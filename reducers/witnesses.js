export const SAVE_WITNESS = 'WITNESSES_0';
export const SAVE_WITNESSES = 'WITNESSES_1';

export default (state = {
    lastSync: 0,
    witnessList: {}
}, action) => {
    switch(action.type) {
        case SAVE_WITNESS:
            return {
                ...state,
                lastSync: Date.now(),
                witnessList: {
                    ...state.witnessList,
                    [action.state.witnessID]: action.state.witness
                }
            }
        case SAVE_WITNESSES:
            return {
                ...state,
                lastSync: Date.now(),
                witnessList: action.state
            }
        default:
            return state;
    }
}

export function saveWitness(witnessID, witness) {
    return {
        type: SAVE_WITNESS,
        state: {
            witnessID,
            witness
        }
    }
}

export function saveWitnesses(witnesses) {
    return {
        type: SAVE_WITNESSES,
        state: witnesses
    }
}