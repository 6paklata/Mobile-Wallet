import TronTools from 'tron-http-tools';
import _ from 'underscore';

import { store } from 'app/App';

import * as TronAPI from './api';

// Contract List: https://github.com/tronprotocol/protocol/blob/master/core/Contract.proto

export const UNSUPPORTED_TRANSACTION = 'UNSUPPORTED_TRANSACTION';
export const VALID_TRANSACTIONS = [
    'TransferContract',                      // TRX transfer
    'TransferAssetContract',                 // Token transfer
    // 'VoteWitnessContract',                   // Vote for SR transfer
    // 'AssetIssueContract',                    // Create token transfer
    // 'ParticipateAssetIssueContract',         // Purchase token transfer
    'FreezeBalanceContract',                 // Freeze balance transfer
    'UnfreezeBalanceContract',               // Unfreeze balance transfer
    // 'UnfreezeAssetContract'                  // Unfreeze purchased token transfer
];

export const parseContract = (contract, address, previousContracts = []) => {
    const {
        block_id: block,
        contract_desc: category,
        owner_address: from,
        to_address: to,
        txsize: size,
        txhash: transactionID,
        amount,
        timestamp
    } = contract;

    const details = {
        partner: from == address ? to : from,
        direction: from == address ? 'out' : 'in',
        block,
        transactionID,
        timestamp,
        amount,
        size
    };

    switch(category) {
        case 'TransferContract':
            return {
                category: 'Transfer',
                token: 'Tron',
                ...details,
                amount: details.amount / 1000000
            }
        case 'TransferAssetContract':
            return {
                category: 'Transfer',
                token: contract.asset_name,
                ...details
            }
        case 'FreezeBalanceContract':
            return [
                {
                    ...details,
                    category: 'Frozen',
                    token: 'Tron',
                    direction: 'out',
                    amount: contract.frozen_balance / 1000000
                },
                {
                    ...details,
                    category: 'Frozen',
                    token: 'TronPower',
                    direction: 'in',
                    amount: contract.frozen_balance / 1000000                  
                }
            ];
        case 'UnfreezeBalanceContract':
            const amount = previousContracts.filter(({ category }) => {
                return category == 'Frozen'
            }).reduce((total, ({ amount, direction }) => {
                return total + (direction == 'in' ? amount : -amount)
            }));

            return [
                {
                    ...details,
                    category: 'Frozen',
                    token: 'Tron',
                    direction: 'in',
                    amount: amount / 1000000
                },
                {
                    ...details,
                    category: 'Frozen',
                    token: 'TronPower',
                    direction: 'out',
                    amount: amount / 1000000
                }
            ];
        default:
            return UNSUPPORTED_TRANSACTION;
    }
};

export const getTransactions = async (address, startDate = 0, endDate = Date.now()) => {
    const contracts = await TronAPI.getContracts(address, startDate, endDate);

    if(!contracts)
        return [];

    const transactions = contracts.map((contract, index) => {
        return parseContract(contract, address, contracts.slice(0, index))
    }).filter(contract => {
        return contract !== UNSUPPORTED_TRANSACTION
    }).reduce((transactions, contract) => {
        transactions.push(...(Array.isArray(contract) ? contract : [ contract ]));
        return transactions;
    }, []).sort((a, b) => b.timestamp - a.timestamp);

    return _.uniq(transactions, true);
};

export const getBalances = async address => {
    const account = await TronAPI.getAccount(address);
    
    if(!account)
        return { Tron: 0, TronPower: 0};

    const balances = {
        Tron: account.trx / 1000000, // Response is in SUN
        TronPower: account.frozen_balance / 1000000
    };

    Object.entries(account.tokens).forEach(([ token, amount ]) => {
        balances[token] = amount;
    });

    return balances;
};

export const getFozenExpiry = async address => {
    const account = await TronAPI.getAccount(address);
    
    if(!account)
        return false;

    return account.frozen_expire_time;
};

export const getTokens = async () => {
    const tokens = await TronAPI.getTokens();

    if(!tokens)
        return false;

    return tokens.map(token => ({
        name: token.name,
        supply: token.total_supply,
        issued: (token.bought / token.trx_num) * token.num,
        website: token.url,
        registered: token.timestamp,
        begins: token.start_time,
        ends: token.end_time,
        description: token.description,
        abbreviation: token.abbr ? token.abbr.toUpperCase() : false,
        address: token.owner_address
    })).reduce((tokens, token) => {
        return tokens[token.name] = token, tokens;
    }, {})
};

export const getWitnesses = async () => {
    const witnesses = await TronAPI.getWitnesses();

    if(!witnesses)
        return false;

    return witnesses.sort((a, b) => {
        return b.votecount - a.votecount
    }).map((witness, index) => ({
        position: index + 1,
        url: witness.url,
        address: witness.address,
        meta: {
            lastBlock: witness.latestblocknum,
            blocksProduced: witness.totalproduced,
            blocksMissed: witness.totalmissed,
            votes: witness.votecount
        }
    })).reduce((witnesses, witness) => {
        return witnesses[witness.url] = witness, witnesses;
    }, {});
}

export const signAndBroadcast = async (transaction, privateKey) => {
    const signed = TronTools.transactions.signTransaction(privateKey, transaction);
    return await TronAPI.broadcastTransaction(signed);
}

export const freeze = async ({ privateKey, publicKey }, amount) => {
    const lastBlock = await TronAPI.getLastBlock();

    const props = {
        ownerAddress: publicKey,
        duration: 3,
        amount: amount * 1000000 // Amount is in SUN
    }

    console.log({ publicKey, privateKey, ...props });

    const transaction = await TronTools.transactions.createUnsignedFreezeBalanceTransaction(props, lastBlock);
    return await signAndBroadcast(transaction, privateKey);
}

export const unfreeze = async ({ privateKey, publicKey }) => {
    const lastBlock = await TronAPI.getLastBlock();

    const props = {
        ownerAddress: publicKey
    }

    const transaction = await TronTools.transactions.createUnsignedUnfreezeBalanceTransaction(props, lastBlock);
    return await signAndBroadcast(transaction, privateKey);
}

export const offlineSignature = async ({ privateKey, publicKey }, recentBlockBase64, contractType, args) => {
    const contractName = `createUnsigned${contractType}Transaction`;
    const recentBlock = TronTools.blocks.blockFromBase64(recentBlockBase64);

    const props = {
        ownerAddress: publicKey,
        sender: publicKey,
        ...args
    };

    const unsigned = await TronTools.transactions[contractName](props, recentBlock);
    const signed = TronTools.transactions.signTransaction(privateKey, unsigned);

    return signed;
}

export const witnessVote = async ({ privateKey, publicKey }, ...votes) => {
    const lastBlock = await TronAPI.getLastBlock();

    const props = {
        ownerAddress: publicKey,
        votes
    };

    const transaction = await TronTools.transactions.createUnsignedVoteWitnessTransaction(props, lastBlock);
    return await signAndBroadcast(transaction, privateKey);
};

export const send = async (account, { address, token, amount }) => {
    if(token == 'Tron')
        return sendTron(account, { address, amount });

    const { privateKey, publicKey } = account;
    const lastBlock = await TronAPI.getLastBlock();

    const props = {
        sender: publicKey,
        recipient: address,
        assetName: token,
        amount
    };

    const transaction = await TronTools.transactions.createUnsignedTransferAssetTransaction(props, lastBlock);
    return await signAndBroadcast(transaction, privateKey);
}

export const sendTron = async ({ publicKey, privateKey }, { address, amount }) => {
    const lastBlock = await TronAPI.getLastBlock();

    const props = {
        sender: publicKey,
        recipient: address,
        amount: amount * 1000000 // Amount is in SUN
    };

    const transaction = await TronTools.transactions.createUnsignedTransferTransaction(props, lastBlock);
    return await signAndBroadcast(transaction, privateKey);
}

export const createToken = async ({ publicKey, privateKey }, token) => {
    token.sender = publicKey;

    const lastBlock = await TronAPI.getLastBlock();
    const transaction = await TronTools.transactions.createUnsignedAssetIssueTransaction(token, lastBlock);

    return await signAndBroadcast(transaction, privateKey);
}