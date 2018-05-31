import UUID from 'uuid/v4';

import { Constants } from 'expo';

import { store } from 'app/App';
import { Utils } from 'app/config';

import * as app from 'app/reducers/app';
import * as wallets from 'app/reducers/wallets';
import * as contacts from 'app/reducers/contacts';
import * as tokens from 'app/reducers/tokens';
import * as witnesses from 'app/reducers/witnesses';

export const decryptGlobalKey = () => {
    const state = store.getState();

    const { globalKey } = state.app;

    return Utils.crypto.decrypt(globalKey, Constants.sessionId).toString();
}

export const createAccount = ({ privateKey, publicKey, wordList }, walletName, blockchainName = false) => {
    const passcode = decryptGlobalKey();

    const account = {
        name: walletName,
        transactions: [],
        balances: {
            Tron: 0,
            TronPower: 0
        },
        votes: {},
        accountID: UUID(),
        lastSync: -1,
        blockchainName,
        privateKey,
        publicKey,
        wordList
    };

    const encrypted = Utils.crypto.encrypt(account, passcode);

    store.dispatch(wallets.saveAccount(account));
    store.dispatch(app.saveAccount(account.accountID, encrypted));
}

export const setWalletMode = mode => {
    store.dispatch(app.setWalletMode(mode));
}

export const saveAccount = account => {
    const passcode = decryptGlobalKey();

    const encrypted = Utils.crypto.encrypt(account, passcode);

    store.dispatch(wallets.saveAccount(account));
    store.dispatch(app.saveAccount(account.accountID, encrypted));
}

export const deleteAccount = accountID => {
    store.dispatch(wallets.deleteAccount(accountID));
    store.dispatch(app.deleteAccount(accountID));
}

export const saveContact = (contactID, contact) => {
    const passcode = decryptGlobalKey();
    const encrypted = Utils.crypto.encrypt(contact, passcode);

    store.dispatch(contacts.saveContact(contactID, contact));
    store.dispatch(app.saveContact(contactID, encrypted));
}

export const deleteContact = (contactID) => {
    store.dispatch(contacts.deleteContact(contactID));
    store.dispatch(app.deleteContact(contactID));
}

export const setLanguage = (language) => {
    store.dispatch(app.setLanguage(language));
}

export const setTheme = (theme) => {
    store.dispatch(utils.setTheme(theme));
}

export const refreshAccount = async (accountID, force = false) => {
    const state = store.getState();

    if(state.app.walletMode == 'cold')
        return false;

    const account = state.wallets.accounts[accountID];

    const { 
        publicKey, 
        transactions,
        balances
    } = account;

    const lastTransaction = Math.max(...transactions.map(({ timestamp }) => timestamp), 0);

    const newTransactions = await Utils.node.getTransactions(publicKey, lastTransaction + 1);
    const newBalances = await Utils.node.getBalances(publicKey);

    if(!newTransactions)
        return 'Failed to load transactions';

    if(!newBalances)
        return 'Failed to load balances';

    account.balances = newBalances;
    account.transactions.push(...newTransactions);
    account.transactions = account.transactions.sort((a, b) => b.timestamp - a.timestamp);
    account.lastSync = Date.now();

    saveAccount(account);

    return false;
}

export const refreshWitnesses = async (force = false) => {
    const state = store.getState();

    if(state.app.walletMode == 'cold')
        return false;

    const witnessList = await Utils.node.getWitnesses();

    Object.entries(witnessList).forEach(([ witnessID, witness ]) => {
        store.dispatch(witnesses.saveWitness(witnessID, witness));
    });

    return false;
}

export const refreshTokens = async (force = false) => {
    const state = store.getState();

    if(state.app.walletMode == 'cold')
        return false;

    const tokenList = await Utils.node.getTokens();

    Object.entries(tokenList).forEach(([ tokenName, token ]) => {
        store.dispatch(tokens.saveToken(token));
    });

    return false;
}