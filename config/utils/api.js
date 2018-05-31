import TronTools from 'tron-http-tools';

import { Buffer } from 'buffer';

import { store } from 'app/App';

export const getContracts = async (address, startDate = 0, endDate = Date.now()) => {
    const { api } = store.getState().app;
    const url = `${api}/getTransactionsRelatedToThis?address=${address}&start=${startDate}&end=${endDate}`;

    console.log(`Requesting transactions for ${address} from ${startDate} to ${endDate}`);
    console.log(url);

    return await fetch(url)
        .then(res => res.json())
        .catch(res => false);
}

export const getAccount = async address => {
    const { api } = store.getState().app;
    const url = `${api}/getAccount?address=${address}`;

    console.log(`Requesting account for ${address}`);
    console.log(url);

    return await fetch(url)
        .then(res => res.json())
        .catch(res => false);
}

export const getTokens = async () => {
    const { api } = store.getState().app;
    const url = `${api}/getTokens`;

    return await fetch(url)
        .then(res => res.json())
        .catch(res => false);
}

export const getWitnesses = async () => {
    const { api } = store.getState().app;
    const url = `${api}/grpc/listWitnesses`;

    return await fetch(url)
        .then(res => res.text())
        .then(res => {
            return TronTools.witnesses.witnessesFromWitnessListBase64(res);
        })
        .catch(res => false); 
}

export const getLastBlock = async () => {
    const { api } = store.getState().app;
    const url = `${api}/grpc/getLastBlock`;

    return await fetch(url)
        .then(res => res.text())
        .then(res => {
            return TronTools.blocks.blockFromBase64(res);
        })
        .catch(res => false); 
}

export const broadcastTransaction = async transaction => {
    const { api } = store.getState().app;
    const url = `${api}/grpc/broadcastTransaction`;

    const encodedTransaction = TronTools.utils.base64EncodeToString(transaction.serializeBinary());

    console.log(`Broadcasting transaction: ${encodedTransaction}`);

    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            transaction: encodedTransaction 
        })
    }).then(res => res.text()).then(res => {
        const decoded = TronTools.api.returnFromBase64(res).toObject();

        if(decoded && !decoded.result)
            decoded.message = Buffer.from(decoded.message, 'base64').toString();

        return decoded;
    }).catch(res => false);
}