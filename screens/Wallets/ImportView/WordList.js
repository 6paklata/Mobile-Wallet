import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Animated } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';
import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class WordList extends React.Component {
    state = {
        wordList: '',
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.props.navigation.navigate('WalletNameView') } />,
    }

    componentWillMount() {
        this.setState({
            // account: Utils.crypto.createAccount(),
            ...this.props.navigation.state.params      
        });
    }

    completeSetup() {
        const {
            walletName,
        } = this.state;

        const account = Utils.crypto.createAccountFromMnemonic(this.state.wordList);
        
        // Store account
        this.props.createAccount(account, walletName);    
         
        setTimeout(() => {
            this.props.navigation.navigate('ListView');
        }, 0);
    }

    render() {
        const wordCount = () => this.state.wordList.split(' ').length;

        const wordText = () => {
            const words = this.state.wordList.split(' ').length;

            if (this.state.wordList == '')
                return '0 words';

            return words == 1 ? '1 word' : `${words} words`; 
        }

        const button = wordCount() != 24 ? (
            <View style={[ styles.button, styles.buttonDisabled, { width: '80%' } ]}>
                <Text style={[ styles.buttonText, styles.buttonTextDisabled ]}>Please enter 24 words</Text>
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
                    <Text style={ styles.header }>Enter your word list below.</Text>
                    <Text style={ styles.content }>
                        You have entered { wordText() }
                    </Text>
                    <TextInput
                        multiline={ true }
                        onChangeText={ (wordList) => this.setState({ wordList }) }
                        value={ this.state.wordList }
                        style={ styles.wordList }>
                    
                    </TextInput>
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
    wordList: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '80%',
        maxWidth: '80%',
        justifyContent: 'space-between',
        paddingTop: 30,
        paddingBottom: 30,
        marginBottom: 15,
        borderRadius: 5,
        color: 'white',
    },
    wordListText: {
        fontSize: 18,
        paddingRight: 10,
        height: 30,
        paddingLeft: 10,
        textAlign: 'center',
        alignItems: 'center'
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
});

export default connect(state => state, dispatch => ({
    createAccount: (account, accountName) => Utils.reducers.createAccount(account, accountName)
}))(WordList);