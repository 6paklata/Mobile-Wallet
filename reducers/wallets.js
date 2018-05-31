import TronTools from 'tron-http-tools';

export const SET_LOADED = 'WALLETS_3';
export const SAVE_ACCOUNT = 'WALLETS_4';
export const DELETE_ACCOUNT = 'WALLETS_5';

export default (state = {
    loaded: false,
    lastSync: 0,
    accounts: {}
}, action) => {
    switch(action.type) {
        case SAVE_ACCOUNT:
            return {
                ...state,
                lastSync: Date.now(),
                accounts: {
                    ...state.accounts,
                    [action.state.accountID]: {
                        ...action.state
                    }
                }
            }
        case SET_LOADED:
            return {
                ...state,
                loaded: true
            }
        case DELETE_ACCOUNT:
            delete state.accounts[action.state.accountID];
            return state;
        default:
            return state;
    }
}

export const saveAccount = account => ({
    type: SAVE_ACCOUNT,
    state: account
});

export const deleteAccount = accountID => ({
    type: DELETE_ACCOUNT,
    state: { accountID }
})

export const setLoaded = () => ({ type: SET_LOADED });
