export const SAVE_TOKEN = 'TOKENS_0';

export default (state = {
    lastSync: 0,
    tokenList: {}
}, action) => {
    switch(action.type) {
        case SAVE_TOKEN:
            return {
                ...state,
                lastSync: Date.now(),
                tokenList: {
                    ...state.tokenList,
                    [action.state.name]: action.state
                }                
            }
        default:
            return state;
    }
}

export function saveToken(token) {
    return {
        type: SAVE_TOKEN,
        state: token
    }
}