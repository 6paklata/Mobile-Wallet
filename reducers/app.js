import { Constants } from 'expo';

import CryptoJS from 'crypto-js';

export const CHANGE_WALLET_MODE = 'APP_0';
export const SET_GLOBAL_ERROR = 'APP_1';
export const MARK_READY = 'APP_2';
export const SET_GLOBAL_KEY = 'APP_4';
export const SET_SECURE_STORE = 'APP_5';
export const SET_APP_SETUP = 'APP_6';
export const SET_PASSWORD_MODE = 'APP_7';
export const SAVE_ACCOUNT = 'APP_9';
export const CHANGE_LANGUAGE = 'APP_10';
export const SAVE_CONTACT = 'APP_11';
export const DELETE_CONTACT = 'APP_12';
export const DELETE_ACCOUNT = 'APP_13';

export default (state = {
    api: 'https://api.tron.watch',
    walletMode: 'cold',
    language: 'en',
    globalError: false,
    setup: false, // If false, show the intro screens & disable decryption component
    passwordMode: 6, // 4, 6 or alphanumeric
    ready: {
        wallets: false,
        representatives: false,
        tokens: false
    },
    // This is the global decryption key. This is encrypted with Expo.Constants.sessionId,
    // which is generated on app launch. This is so the key isn't stored in plaintext.
    globalKey: '',
    // All items are stored with a global key, also encrypted with SecureStore
    // which will offer two levels of encryption (hardware via device, password
    // from the user).
    secureStore: {
        accounts: false,
        contacts: false,
        representatives: false, // (Global representative key)
        tokens: false // (Global token key)
    }
}, action) => {
    switch(action.type) {
        case SET_GLOBAL_KEY:
            return {
                ...state,
                globalKey: action.state.globalKey
            }
        case CHANGE_WALLET_MODE:
            return { 
                ...state, 
                walletMode: action.state.mode
            };;
        case SET_GLOBAL_ERROR:
            return {
                ...state,
                globalError: action.state.error
            };
        case MARK_READY:
            return {
                ...state,
                ready: {
                    ...state.ready,
                    [action.state.key]: action.state.flag
                }
            };
        case SET_APP_SETUP:
            return {
                ...state,
                setup: true
            }
        case SET_PASSWORD_MODE:
            return {
                ...state,
                passwordMode: action.state.passwordMode
            }
        case SAVE_ACCOUNT:
            return {
                ...state,
                secureStore: {
                    ...state.secureStore,
                    accounts: {
                        ...(state.secureStore.accounts || {}),
                        [action.state.accountID]: action.state.encryptedAccount
                    }
                }
            }
        case SAVE_CONTACT:
            return {
                ...state,
                secureStore: {
                    ...state.secureStore,
                    contacts: {
                        ...(state.secureStore.contacts || {}),
                        [action.state.contactID]: action.state.encryptedContact
                    }
                }
            }
        case DELETE_CONTACT:
            delete state.secureStore.contacts[action.state.contactID];
            return state;
        case DELETE_ACCOUNT:
            delete state.secureStore.accounts[action.state.accountID];
            return state;
        case CHANGE_LANGUAGE:
            return {
                ...state,
                language: action.state.language,
            }
        default:
            return state;
    }
}

export const setWalletMode = mode => ({
    type: CHANGE_WALLET_MODE,
    state: { mode }
});

export const setGlobalError = error => ({
    type: SET_GLOBAL_ERROR,
    state: { error }
});

export const markReady = (key, flag) => ({
    type: MARK_READY,
    state: { key, flag }
});

export const setGlobalKey = code => {
    if(!code) {
        return {
            type: SET_GLOBAL_KEY,
            state: { globalKey: false }
        }
    }

    const { sessionId: sessionID } = Constants;
    const globalKey = CryptoJS.AES.encrypt(code, sessionID).toString();

    return {
        type: SET_GLOBAL_KEY,
        state: { globalKey }
    }
};

export const setAppSetup = () => ({
    type: SET_APP_SETUP
});

export const setPasswordMode = passwordMode => ({
    type: SET_PASSWORD_MODE,
    state: { passwordMode }
})

export const saveAccount = (accountID, encryptedAccount) => ({
    type: SAVE_ACCOUNT,
    state: { accountID, encryptedAccount }
});

export const saveContact = (contactID, encryptedContact) => ({
    type: SAVE_CONTACT,
    state: { contactID, encryptedContact }
});

export const deleteContact = contactID => ({
    type: DELETE_CONTACT,
    state: { contactID },
});

export const deleteAccount = accountID => ({
    type: DELETE_ACCOUNT,
    state: { accountID },
});

export const setLanguage = language => ({
    type: CHANGE_LANGUAGE,
    state: { language },
});
