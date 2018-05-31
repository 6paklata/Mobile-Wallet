export const SAVE_CONTACT = 'CONTACTS_0';
export const DELETE_CONTACT = 'CONTACTS_1';

// get default state from local storage
export default (state = {
    logos: {
        binance: require('app/assets/images/logos/binance.png'),
    },
    contacts: {}
}, action) => {
    switch(action.type) {
        case SAVE_CONTACT:
            return { 
                ...state, 
                contacts: {
                    ...state.contacts,
                    [action.state.contactID]: action.state.contact
                }
            }
        case DELETE_CONTACT:
            delete state.contacts[action.state.contactID];
            return state;
        default:
            return state;
    }
}

export function saveContact(contactID, contact) {
    return {
        type: SAVE_CONTACT,
        state: {
            contactID,
            contact
        }
    }
}

export function deleteContact(contactID) {
    return {
        type: DELETE_CONTACT,
        state: {
            contactID,
        }
    }
}
