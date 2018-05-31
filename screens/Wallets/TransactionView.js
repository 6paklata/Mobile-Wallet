import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient, Linking, WebBrowser } from 'expo';
import moment from 'moment';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';

class TransactionView extends React.Component {
    state = {
        transaction: false,
        wallet: false,
        walletID: false
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.navigateBack() } showBorder />,
        right: <HeaderButton icon='link' onPress={ () => this.openTransaction() } />
    }

    navigateBack() {
        const { walletID } = this.state;
        this.props.navigation.navigate('DetailedView', { walletID });
    }

    openTransaction() {
        const link = `https://tronscan.org/#/transaction/${ this.state.transaction.transactionID }`;

        if(this.props.app.walletMode == 'hot')
            return WebBrowser.openBrowserAsync(link);

        Linking.openURL(link);            
    }

    componentWillMount() {
        this.props = {
            ...this.props,
            ...this.props.navigation.state.params
        }

        const { walletID } = this.props;
        const wallet = this.props.wallets[walletID];

        const transactionExists = wallet.transactions.some(({ transactionID }) => transactionID == this.props.transactionID);

        if(!transactionExists)
            return this.navigateBack();

        this.setState({
            walletID,
            wallet,
            transaction: wallet.transactions.filter(({ transactionID }) => transactionID == this.props.transactionID)[0]
        });
    }

    render() {
        const { wallet, walletID, transaction } = this.state;
        const { contactLogos, contacts } = this.props;

        const contactMap = Object.entries(contacts).reduce((contacts, [ contactID, { addresses } ]) => {
            addresses.forEach(address => contacts[address] = contactID);
            return contacts;
        }, {});

        const transactionState = {
            icon: transaction.direction == 'out' ? 'arrow-forward' : 'arrow-back',
            tag: transaction.direction == 'out' ? 'Sent' : 'Received',
            tagFull: transaction.direction == 'out' ? 'Sent to' : 'Received from',
            tagFullWallet: transaction.direction == 'out' ? 'Sent from' : 'Sent to'
        }

        const partner = {
            contact: contactMap.hasOwnProperty(transaction.partner) ? { 
                ...contacts[contactMap[transaction.partner]],
                name: contactMap[transaction.partner]
            } : false,
            address: transaction.partner
        };

        const feePercent = Number(transaction.fee / transaction.amount * 100).toFixed(2);

        const contact = () => {

            if(partner.contact) {
                const logo = partner.contact.logo ? contactLogos[partner.contact.logo] : false;
                const contactName = <Text style={{ color: '#828282', fontSize: 18 }}>{ partner.contact.name }</Text>;

                if(logo) {
                    return (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={ logo } style={{ width: 30, height: 30, marginRight: 20 }} />
                            { contactName }
                        </View>
                    );
                }

                return contactName;
            }

            return <Text style={{ color: '#828282', fontSize: 16 }}>{ partner.address }</Text>;
        }

        return (
            <View style={{ flex: 1 }}>
                <Header title={ transactionState.tag + ' Funds' } leftButton={ this.headerButtons.left } rightButton={ this.headerButtons.right } />
                <View style={{ margin: 16.5, marginTop: 0, marginBottom: 0, flex: 1, borderRadius: 15, overflow: 'hidden' }}>                    
                    <LinearGradient start={[ 1, 0 ]} end={[ 0, 0 ]} colors={ this.props.utils.theme.highlightGradient } style={{ 
                        position: 'absolute',
                        left: 0,
                        padding: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 125,
                        right: 0,
                        zIndex: 2
                    }}>   
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: '#ffffff', fontSize: 18, fontWeight: '500' }}>
                                { transactionState.tag + ':' }
                            </Text>
                            <Text style={{ color: '#ffffff', fontSize: 22, marginTop: 1, fontFamily: 'source-code-pro', paddingRight: 20 }} numberOfLines={ 1 }>
                                { transaction.amount } { transaction.token }
                            </Text>
                            <Text style={{ color: '#ffffff', fontSize: 16, marginTop: 1, fontFamily: 'source-code-pro' }}>
                                00,000.00 USD
                            </Text>
                        </View>
                        <MaterialIcons
                            name={ transactionState.icon }
                            color={ '#ffffff' }
                            size={ 20 }
                        />                            
                    </LinearGradient>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ 
                            borderRadius: 15, 
                            backgroundColor: '#ffffff', 
                            overflow: 'hidden', 
                            flex: 1, 
                            padding: 30, 
                            paddingTop: 735, /* This is so the background is white when a user pulls the view down */
                            marginTop: -600 
                        }}>
                            <View style={ styles.separator }>
                                <Text style={{ color: '#0B0F12', fontSize: 18, marginBottom: 10, fontWeight: '500' }}>{ transactionState.tagFull }:</Text>
                                { contact() }
                            </View>
                            <View style={ styles.separator }>
                                <Text style={{ color: '#0B0F12', fontSize: 18, marginBottom: 10, fontWeight: '500' }}>{ transactionState.tagFullWallet }:</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons 
                                        name={ 'account-balance-wallet' }
                                        color={ '#9B9B9B' }
                                        size={ 30 }
                                        style={{ marginRight: 20 }}
                                    />
                                    <Text style={{ color: '#828282', fontSize: 18 }}>{ wallet.name }</Text>
                                </View>
                            </View>
                            <View style={{ paddingTop: 20 }}>
                                <Text style={{ color: '#0B0F12', fontSize: 18, marginBottom: 10, fontWeight: '500' }}>Date:</Text>
                                <Text style={{ color: '#828282', fontSize: 16 }}>{ moment(transaction.timestamp).format('LLL') }</Text>
                            </View>
                        </View>
                    </ScreenView>
                </View>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    separator: {
        paddingBottom: 20, 
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        paddingTop: 20
    }
});

export default connect(state => ({ 
    wallets: state.wallets.accounts,
    contacts: state.contacts.contacts,
    contactLogos: state.contacts.logos,
    utils: state.utils,
    app: state.app
}))(TransactionView);