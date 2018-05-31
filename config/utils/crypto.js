import { Constants } from 'expo';

import CryptoJS from 'crypto-js';
import TronTools from 'tron-http-tools';

export const DECRYPTION_FAILED = 'DECRYPTION_FAILED';

export const decryptGlobalKey = encryptedGlobalKey => {
    const { sessionId: sessionID } = Constants;

    const bytes = CryptoJS.AES.decrypt(encryptedGlobalKey, sessionID);
    const globalKey = bytes.toString(CryptoJS.enc.Utf8);

    return globalKey;
}

export const encrypt = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

export const decrypt = (encrypted, key) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, key);
        const json = bytes.toString(CryptoJS.enc.Utf8);

        return JSON.parse(json);
    } catch(ex) {
        return DECRYPTION_FAILED;
    }
}

export const createAccount = () => {
    const account = TronTools.accounts.generateRandomBip39();

    const {
        address: publicKey,
        words: wordList,
        privateKey,
    } = account;

    return { 
        privateKey, 
        publicKey, 
        wordList 
    };
}

export const createAccountFromMnemonic = (mnemonic) => {
    const account = TronTools.accounts.accountFromMnemonicString(mnemonic);

    const {
        address: publicKey,
        words: wordList,
        privateKey,
    } = account;

    return { 
        privateKey, 
        publicKey, 
        wordList 
    };
}

export const createAccountFromPrivateKey = (privateKey) => {
    const account = TronTools.accounts.accountFromPrivateKey(privateKey);

    const {
        address: publicKey,
    } = account;

    return {
        privateKey,
        publicKey
    };
}
