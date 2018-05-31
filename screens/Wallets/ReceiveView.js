import React from 'react';
import QRCode from 'react-native-qrcode-svg';

import { View, Text, StyleSheet, TouchableOpacity, Clipboard, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient, Linking, WebBrowser } from 'expo';

import ScreenView from 'app/components/ScreenView';

import { Utils } from 'app/config';
import { Header, HeaderButton } from 'app/components/Header';

const { Scale } = Utils;

const tronWatchLogo = require('app/assets/images/TronWatch.png');

class ReceiveView extends React.Component {
    state = {
        account: false,
        accountID: false
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.navigateBack() } showBorder />
    }

    navigateBack() {
        this.props.navigation.navigate('DetailedView', { walletID: this.state.accountID });
    }

    componentWillMount() {
        this.props = {
            ...this.props,
            ...this.props.navigation.state.params
        }

        const { accountID } = this.props;
        const account = this.props.wallets[accountID];

        this.setState({
            accountID,
            account
        });
    }

    content() {
        const address = this.state.account.publicKey;

        const copyAddress = () => {
            Clipboard.setString(address);
            Alert.alert('Copied to Clipboard', 'Your account address has been copied to your clipboard', [{ 
                text: 'Okay', 
                onPress: () => {} 
            }]);
        }

        return (
            <View style={{ padding: 30, backgroundColor: '#ffffff', borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingTop: 30 }}>
                <Text style={ styles.header }>
                    Share your address with friends, family and others to receive Tron instantly
                </Text>
                <QRCode value={ address } size={ 200 } logo={ tronWatchLogo } logoBackgroundColor={ 'transparent' } logoSize={ 100 } />
                <TouchableOpacity style={ styles.addressContainer } onPress={ () => copyAddress() }>
                    <Text style={ styles.address }>
                        { address }
                    </Text>
                </TouchableOpacity>
                <Text style={ styles.content }>
                    Use the address above to receive Tron and other tokens. Press the address to copy it to your clipboard
                </Text>
            </View>
        )
    }

    render() {      
        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Receive Funds' } leftButton={ this.headerButtons.left } />
                <ScreenView style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                        { this.content () }
                    </View>
                </ScreenView>            
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        fontSize: 18,
        color: '#0B0F12',
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },
    button: {
        borderRadius: 5,
        padding: 20,
        backgroundColor: '#0b0f12d1',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    addressContainer: {
        marginTop: 30,
        padding: 20,
        backgroundColor: '#eeeeee',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    address: {        
        textAlign: 'center',
        fontSize: 16,
        flexWrap: 'wrap',
        fontFamily: 'source-code-pro'
    },
    content: {
        marginTop: 30,
        fontSize: 16,
        textAlign: 'center',
        flexWrap: 'wrap',
        color: '#828282'
    }
});

export default connect(state => ({ 
    wallets: state.wallets.accounts,
    utils: state.utils,
    app: state.app
}))(ReceiveView);