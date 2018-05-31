import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Animated } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';
import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class WordList extends React.Component {
    state = {
        remaining: 30
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.props.navigation.navigate('WalletNameView') } />,
    }

    componentWillMount() {
        this.setState({
            account: Utils.crypto.createAccount(),
            ...this.props.navigation.state.params      
        });

        this.startCountdown();
    }

    async startCountdown() {
        while(this.state.remaining > 0) {
            await Utils.timeout(1000);

            this.setState({ 
                remaining: this.state.remaining - 1
            });
        }
    }

    completeSetup() {
        const {
            walletName,
            account
        } = this.state;
        
        // Store account
        this.props.createAccount(account, walletName);    
         
        setTimeout(() => {
            this.props.navigation.navigate('ListView');
        }, 0);
    }

    render() {
        const wordList = this.state.account.wordList.map((word, index) => {
            let color = '#ffffff';

            if(index % 2 == 1)
                color = '#eeeeee';

            return <Text key={ index } style={[ styles.wordListText, { color } ]}>{ word }</Text>
        });

        const button = this.state.remaining > 0 ? (
            <View style={[ styles.button, styles.buttonDisabled, { width: '80%' } ]}>
                <Text style={[ styles.buttonText, styles.buttonTextDisabled ]}>Please wait { this.state.remaining }s</Text>
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
                    <Text style={ styles.header }>Your wallet has been created</Text>
                    <Text style={ styles.content }>
                        Please carefully write down this unique phrase. 
                        It will allow you to restore your wallet in the event 
                        of data corruption or losing your device
                    </Text>
                    <View style={ styles.wordList }>
                        { wordList }
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