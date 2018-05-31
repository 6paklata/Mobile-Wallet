import React from 'react';

import { SecureStore, Constants, LinearGradient } from 'expo';
import { connect } from 'react-redux';
import { View, Text, StatusBar, StyleSheet } from 'react-native';

import { Utils } from 'app/config';

import { setGlobalKey } from 'app/reducers/app';
import { saveAccount, setLoaded } from 'app/reducers/wallets';
import { saveContact } from 'app/reducers/contacts';

import SafeView from 'app/components/SafeView';
import Fade from 'app/components/Fade';

import Password from './Password';

const DecryptionState = {
    WAITING_FOR_PASSWORD: false,
    DECRYPTING_WALLETS: 'Decrypting wallets',
    DECRYPTING_CONTACTS: 'Decrypting contacts',
    DECRYPTING_REPRESENATITIVES: 'Loading representatives',
    DECRYPTING_TOKENS: 'Loading tokens'
};

class Decryption extends React.Component {
    state = {
        decryptionState: DecryptionState.WAITING_FOR_PASSWORD,
        text: {
            info: 'Please enter your memorable code',
            error: ''
        }
    }

    invalidPassword() {
        this.setState({
            decryptionState: DecryptionState.WAITING_FOR_PASSWORD,
            text: {
                info: '',
                error: 'Incorrect code entered. Please try again'
            }
        });

        return setTimeout(() => {
            this.password.clear();
            this.password.toggleLoading();
        }, 200);
    }

    onPassword(password) {
        this.password.toggleLoading();

        const { 
            accounts, 
            contacts, 
            representatives, 
            tokens 
        } = this.props.app.secureStore;

        if(accounts) {
            this.setState({ 
                decryptionState: DecryptionState.DECRYPTING_WALLETS,
                text: {
                    info: 'Decrypting wallets',
                    error: ''
                }
            });

            for(const [ accountID, encrypted ] of Object.entries(accounts)) {
                const account = Utils.crypto.decrypt(encrypted, password);

                if(account == Utils.crypto.DECRYPTION_FAILED)
                    return this.invalidPassword();

                this.props.saveAccount(account);
            }
        }

        if(contacts) {
            this.setState({ 
                decryptionState: DecryptionState.DECRYPTING_CONTACTS,
                text: {
                    info: 'Decrypting contacts',
                    error: ''
                }
            });

            for(const [ contactID, encrypted ] of Object.entries(contacts)) {
                const contact = Utils.crypto.decrypt(encrypted, password);

                if(contact == Utils.crypto.DECRYPTION_FAILED)
                    return this.invalidPassword();

                this.props.saveContact(contactID, contact);
            }
        }

        this.props.setGlobalKey(password);
        this.props.setAccountsLoaded();

        if(this.props.onDecryptionComplete) {
            setTimeout(() => {
                this.props.onDecryptionComplete(password)
            }, 0);
        }
    }

    render() {
        return (
            <React.Fragment>
                <LinearGradient colors={ this.props.utils.theme.backgroundGradient } style={ styles.container } />
                <StatusBar barStyle='light-content' translucent={ true } backgroundColor={ 'transparent' } />
                <SafeView style={ styles.content }>
                    <Password 
                        mode={ this.props.app.passwordMode } 
                        modeChangeable={ false }
                        onPassword={ password => this.onPassword(password) }
                        text={ this.state.text }
                        theme={ this.props.utils.theme }
                        ref={ instance => { this.password = instance } }
                    /> 
                </SafeView>
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        flex: 1,
    },
    content: {
        flex: 1, 
        paddingTop: Utils.statusBarOffset,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

const mapStateToProps = state => ({
    app: state.app,
    wallets: state.wallets,
    representatives: state.representatives,
    contacts: state.contacts,
    utils: state.utils
});

const mapDispatchToProps = dispatch => ({
    saveAccount: account => dispatch(saveAccount(account)),
    saveContact: (contactID, contact) => dispatch(saveContact(contactID, contact)),
    setGlobalKey: passcode => dispatch(setGlobalKey(passcode)),
    setAccountsLoaded: () => dispatch(setLoaded())
});

export default connect(mapStateToProps, mapDispatchToProps)(Decryption);