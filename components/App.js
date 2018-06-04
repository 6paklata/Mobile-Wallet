import React from 'react';

import { BackHandler, Platform, StatusBar, StyleSheet, View, Image, Alert } from 'react-native';
import { NavigationActions } from 'react-navigation';
import { Asset, Font, Constants } from 'expo';
import { LinearGradient } from 'expo'
import { MaterialIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';

import { Utils } from 'app/config';

import {
    createReduxBoundAddListener,
    createReactNavigationReduxMiddleware,
    createNavigationReducer
} from 'react-navigation-redux-helpers';

import { 
    setGlobalError,
    setGlobalKey,
    markReady 
} from 'app/reducers/app';

import { 
    saveToken
} from 'app/reducers/tokens';

import {
    saveWitness
} from 'app/reducers/witnesses';

import Navigation from 'app/components/Navigation';
import Footer from 'app/components/Footer';
import SafeView from 'app/components/SafeView';
import LoadingScreen from 'app/components/LoadingScreen';
import Fade from 'app/components/Fade';
import GlobalError from 'app/components/GlobalError';
import Decryption from 'app/components/Decryption';
import Introduction from 'app/screens/Introduction';

class App extends React.Component {
    state = {
        isLoadingComplete: false,
        statusBarOffset: Utils.statusBarOffset
    };

    constructor(props) {
        super(props);
        Utils.navigator.setTopLevelNavigation(this.props.dispatch);
    }

    componentWillMount() {
        this.loadAssets();   
    }

    render() {
        const { setup } = this.props.app;

        const nav = {
            dispatch: this.props.dispatch,
            state: this.props.nav,
            addListener: this.props.addListener
        };

        const isReady = this.props.skipLoadingScreen || this.state.isLoadingComplete;

        return (
            <React.Fragment>
                { !this.props.app.globalError && (
                    <View style={{ flex: 1 }}>                
                        <LinearGradient colors={ this.props.utils.theme.backgroundGradient } style={ styles.background } />
                        <StatusBar barStyle='light-content' translucent={ true } backgroundColor={ 'transparent' } />
                        <SafeView style={{ flex: 1 }} forceInset={{ bottom: 'never' }} style={[ styles.safeView, { paddingTop: this.state.statusBarOffset } ]}>
                            <Navigation navigation={ nav } />            
                            <Footer navigation={ nav } />
                        </SafeView>
                    </View>
                ) }
                <Fade visible={ !isReady } style={ styles.loadingScreen }>
                    <LoadingScreen />
                </Fade>
                <Fade visible={ !setup } style={ styles.screenHolder }>
                    <Introduction onSetupComplete={ passcode => this.startUp(passcode) } />
                </Fade>                
                <Fade visible={ setup && !this.props.wallets.loaded } style={ styles.screenHolder }>
                    <Decryption onDecryptionComplete={ passcode => this.startUp(passcode) } />
                </Fade>
                { this.props.app.globalError && <GlobalError /> }   
            </React.Fragment>            
        );
    }

    async startUp(passcode) {
        this.props.setGlobalError(false);
        this.props.markReady('wallets', false);
        this.props.markReady('representatives', false);
        this.props.markReady('tokens', false);
        this.props.markReady('socket', false);

        const [
            socketError,
            tokensError,
            walletsError,
            representativesError                        
        ] = await Promise.all([
            this.establishSocket(),
            this.loadTokens(passcode) ,
            this.loadWallets(passcode),
            this.loadWitnesses(passcode),                       
        ]);

        /*if(walletsError) {
            this.props.setGlobalError({ 
                title: 'Failed to start', 
                error: walletsError
            });

            return this.setState({ isLoadingComplete: true });
        } else */
        
        this.props.markReady('wallets', walletsError || true);
        this.props.markReady('representatives', representativesError || true);
        this.props.markReady('tokens', tokensError || true);
        this.props.markReady('socket', socketError || true);
        
        this.setState({ isLoadingComplete: true });
    }

    async loadWallets(passcode) {
        if(this.props.app.walletMode == 'cold')
            return false;

        const { accounts } = this.props.wallets;

        for(let [ accountID, account ] of Object.entries(accounts)) {
            const error = await Utils.reducers.refreshAccount(accountID);           

            if(error) {
                Alert.alert(
                    'Failed to update account',
                    error,
                    { text: 'Dismiss', onPress: () => {}, style: 'cancel' }
                )
            }
        }

        return false;
    }

    async loadWitnesses(passcode) {
        if(this.props.app.walletMode == 'cold')
            return 'Representatives are unavailable in cold wallet mode';

        await Utils.reducers.refreshWitnesses();
        return false;
    }

    async loadTokens(passcode) {
        if(this.props.app.walletMode == 'cold')
            return 'Tokens are unavailable in cold wallet mode';

        await Utils.reducers.refreshTokens();
        return false;
    }

    async establishSocket() {
        if(this.props.app.walletMode == 'cold')
            return 'Socket connection is unavailable in cold wallet mode';
    }

    async loadAssets() {
        try {
            await Promise.all([
                Font.loadAsync({
                    ...MaterialIcons.font,
                    'source-code-pro': require('app/assets/fonts/SourceCodeVariable-Roman.ttf')
                }),
                Asset.loadAsync([
                    require('app/assets/images/transaction-sent.png'),
                    require('app/assets/images/transaction-received.png'),
                    require('app/assets/images/logos/binance.png'),
                    require('app/assets/images/tron.png'),
                    require('app/assets/images/TronWatch.png'),
                    require('app/assets/images/introduction/intro-graphic.png'),
                    require('app/assets/images/introduction/name-graphic.png'),
                    require('app/assets/images/introduction/intro-background.png'),
                    require('app/assets/images/introduction/mode-background.png'),
                    require('app/assets/images/introduction/name-background.png'),
                    //require('app/assets/animations/passwordProgressBar.json')
                ])
            ]);
        } catch (exception) {
            return this.handleAssetsError(exception);
        }  
    };

    handleAssetsError = error => {
        // In this case, you might want to report the error to your error
        // reporting service, for example Sentry
        console.warn(error);
        this.props.setGlobalError('Failed to load assets into memory');
    };
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    loadingScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000'
    },
    safeView: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    },
    screenHolder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
    }
});

export default connect(state => state, dispatch => ({
    dispatch,
    setGlobalError: error => {
        dispatch(setGlobalError(error));
    },
    markReady: (key, flag) => {
        dispatch(markReady(key, flag));
    },
    setGlobalKey: key => {
        dispatch(setGlobalKey(key));
    },
    saveAccount: account => {
        Utils.reducers.saveAccount(account);
    },
    saveToken: token => dispatch(saveToken(token)),
    saveWitness: (witnessID, witness) => dispatch(saveWitness(witnessID, witness)),
    refreshAccount: accountID => {
        return Utils.reducers.refreshAccount(accountID);
    }
}))(App);