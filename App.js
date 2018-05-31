import './shim';

import React from 'react';

import { Util } from 'expo';
import { persistStore, persistCombineReducers, purgeStoredState } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import { Utils } from 'app/config';

import UtilsReducer from 'app/reducers/utils';
import WalletsReducer from 'app/reducers/wallets';
import ContactReducer from 'app/reducers/contacts';
import AppReducer from 'app/reducers/app';
import WitnessesReducer from 'app/reducers/witnesses';
import TokensReducer from 'app/reducers/tokens';

import Navigation from 'app/components/Navigation';
import App from 'app/components/App'; 

import createSecureStore from 'redux-persist-expo-securestore';

import {
    createStore,
    applyMiddleware
} from 'redux';

import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
    createNavigationReducer
} from 'react-navigation-redux-helpers';

import { Provider } from 'react-redux';

console.disableYellowBox = true;

const storage = createSecureStore();
const config = {
    key: 'TronWatch',
    whitelist: [ 
        'app',
    ],
    storage
};

const clearState = async (...keys) => {
    if(!keys.length)
        return purgeStoredState(config);

    const state = JSON.parse(await storage.getItem('persist:TronWatch'));
    const app = JSON.parse(state.app);

    keys.forEach(key => {
        delete app.secureStore[key];
    });

    state.app = app;    
    await storage.setItem('persist:TronWatch', JSON.stringify(state));

    console.log('New state:', await storage.getItem('persist:TronWatch'));
    Util.reload();
}

// clearState('contacts');
// purgeStoredState(config);

const reducer = persistCombineReducers(config, {
    nav: createNavigationReducer(Navigation),
    utils: UtilsReducer,
    wallets: WalletsReducer,
    contacts: ContactReducer,
    app: AppReducer,
    witnesses: WitnessesReducer,
    tokens: TokensReducer
});
  
export const store = createStore(
    reducer,
    applyMiddleware(createReactNavigationReduxMiddleware(
        'root',
        state => state.nav,
    )),
);

const persistor = persistStore(store);
const addListener = createReduxBoundAddListener('root');

export default () => (
    <Provider store={ store }>
        <PersistGate loading={ null } persistor={ persistor }>
            <App addListener={ addListener } />
        </PersistGate>
    </Provider>
);