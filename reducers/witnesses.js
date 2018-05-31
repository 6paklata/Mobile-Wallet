export const SAVE_WITNESS = 'WITNESSES_0';

// get default state from local storage
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