import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Animated } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';
import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class PrivateKey extends React.Component {
    state = {
        privateKey: '',
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.props.navigation.navigate('WalletNameView') } />,
    }

    componentWillMount() {
        this.setState({
            ...this.props.navigation.state.params      
        });
    }

    completeSetup() {
        const {
            walletName
        } = this.state;
        
        const account = Utils.crypto.createAccountFromPrivateKey(this.state.privateKey);

        // Store account
        this.props.createAccount(account, walletName);    
         
        setTimeout(() => {
            this.props.navigation.navigate('ListView');
        }, 0);
    }

    render() {
        const button = this.state.privateKey == '' ? (
            <View style={[ styles.button, styles.buttonDisabled, { width: '80%' } ]}>
                <Text style={[ styles.buttonText, styles.buttonTextDisabled ]}>Enter a private key</Text>
            </View>
        ) : (
            <TouchableOpacity style={{ width: '80%' }} onPress={ () => this.completeSetup() }>
                <LinearGradient 
                    colors={ this.props.utils.theme.highlightGradient } 
                    style={ styles.button } 
                    start={[ 1, 0 ]} 
                    end={[ 0, 0 ]} 
                >
                    <Text style={ styles.buttonText }>Continue to wallet</Text>
                </LinearGradient>                
            </TouchableOpacity>
        );
        
        return (
            <View style={{ flex: 1 }}>
                <Header title='Wallet' leftButton={ this.headerButtons.left } />
                <SafeView style={{ flex: 1 }} style={ styles.safeView }>
                    <Text style={ styles.header }>Enter your private key</Text>
                    <Text style={ styles.content }>
                        Enter the private key for the account below.
                    </Text>
                    <View style={ styles.privateKey }>
                            <TextInput 
                                style={ styles.privateKeyInput } 
                                placeholder={ 'Private Key' } 
                                placeholderTextColor={ '#898989' } 
                                underlineColorAndroid={ 'transparent' } 
                                onChangeText={ privateKey => this.setState({ privateKey }) }
                                returnKey={ 'next' }
                            />
                        </View>
                    { button }
                </SafeView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    safeView: {
        flex: 1, 
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        color: '#ffffff',
        fontSize: 22,
        flexWrap: 'wrap',
        maxWidth: '80%',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 15
    },
    content: {
        width: '80%',
        maxWidth: '80%',                
        marginBottom: 25,
        fontSize: 18,
        color: '#dddddd',
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    button: {
        width: '100%',
        borderRadius: 5,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    buttonDisabled: {
        backgroundColor: '#10151a'
    },
    buttonTextDisabled: {
        color: '#aaaaaa'
    },
    privateKey: {        
        width: '80%',
        marginTop: 10,
        backgroundColor: 'rgba(250, 250, 250, 0.1)',
        borderRadius: 5,
        height: 50
    },
    privateKeyInput: {
        paddingLeft: 17,
        paddingRight: 17,
        height: 50,
        color: '#ffffff',
        fontSize: 16,
        width: '100%'
    }
});

export default connect(state => state, dispatch => ({
    createAccount: (account, accountName) => Utils.reducers.createAccount(account, accountName)
}))(PrivateKey);