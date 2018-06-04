export const SAVE_TOKEN = 'TOKENS_0';
export const SAVE_TOKENS = 'TOKENS_1';

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
        case SAVE_TOKENS:
            return {
                ...state,
                lastSync: Date.now(),
                tokenList: action.state
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

export function saveTokens(tokens) {
    return {
        type: SAVE_TOKENS,
        state: tokens
    }
}