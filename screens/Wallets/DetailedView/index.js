import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo';

import { Utils } from 'app/config';

import { setStatusBarColor } from 'app/reducers/utils';
import { Header, HeaderButton } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import DateFilter from './DateFilter';
import Fade from 'app/components/Fade';
import Menu from 'app/components/Menu';

const { scale } = Utils;

class DetailedView extends React.Component {
    state = {
        startDate: 0,
        endDate: 0,
        activeToken: 'Tron'
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.props.navigation.navigate('ListView') } />,
        right: <HeaderButton icon='more-horiz' onPress={ () => this.toggleMenu() } />
    }    

    constructor(props) {
        super(props);

        this.filterTransactions = this.filterTransactions.bind(this);
        Utils.reducers.refreshAccount(this.props.navigation.state.params.walletID);
    }

    componentWillMount() {
        // Copy navigation-set props into local props
        this.props = {
            ...this.props,
            ...this.props.navigation.state.params
        }

        this.setState({ 
            walletID: this.props.walletID,
            wallet: this.props.wallets[this.props.walletID] 
        });
    }

    openSendView() {
        if(this.props.app.walletMode == 'cold')
            return Utils.navigator.navigate('Signer', { contract: 'Transfer' });
        
        const total = Object.values(this.state.wallet.balances).reduce((total, current) => total + Number(current), 0);
        
        if(!total) {
            return Alert.alert('No Tokens Available', 'You cannot send a transaction as you have no tokens available', [{ 
                text: 'Dismiss',
                onPress: () => {},
                style: 'cancel'
            }]);
        }
        
        this.props.navigation.navigate('SendView', { accountID: this.state.walletID })
    }

    openFreezeView() {
        if(this.props.app.walletMode == 'cold')
            return Utils.navigator.navigate('Signer', { contract: 'FreezeBalance' });

        if(!this.state.wallet.balances.Tron) {
            return Alert.alert('No Tron Available', 'You cannot freeze any Tron as you are not currently holding any', [{ 
                text: 'Dismiss',
                onPress: () => {},
                style: 'cancel'
            }]);
        }

        this.props.navigation.navigate('FreezeView', { accountID: this.state.walletID })
    }    

    async unfreeze() {
        if(this.props.app.walletMode == 'cold')
            return Utils.navigator.navigate('Signer', { contract: 'UnfreezeBalance' });

        if(!this.state.wallet.balances.TronPower) {
            return Alert.alert('No TronPower Available', 'You do not have any TronPower to unfreeze', [{ 
                text: 'Dismiss',
                onPress: () => {},
                style: 'cancel'
            }]);
        }

        const onConfirmation = async () => {
            const result = await Utils.node.unfreeze(this.state.wallet);

            if(!result || !result.result) {
                return Alert.alert(
                    'Unfreeze Failed',
                    'Sorry, we couldn\'t unfreeze your TronPower. Has it been 3 days?'
                    [
                        { text: 'Dismiss', onPress: () => {}, style: 'cancel' }
                    ]
                );
            }

            await Utils.reducers.refreshAccount(this.state.accountID, true);

            return Alert.alert(
                'Unfreeze Success',
                'Your TronPower has been unfrozen',
                [
                    { text: 'Dismiss', onPress: () => {}, style: 'cancel' }
                ]
            );
        }

        Alert.alert(
            'Unfreeze Confirmation',
            'Are you sure you want to unfreeze ' + this.state.wallet.balances.TronPower + ' TronPower?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => { onConfirmation() } }
            ]
        );
    }

    toggleMenu() {
        if(this.state.isMenuOpen)
            Utils.feedback();

        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    balanceView() {
        const { wallet, walletID } = this.state;
        const { balances } = wallet;

        // TODO: Token abbreviation from tokens reducer

        const mappedBalances = Object.entries(balances).map(([ token, amount ]) => ({
            token,
            balanceNumeric: amount,
            balance: amount.toLocaleString()
        })).sort((a, b) => b.balanceNumeric - a.balanceNumeric);

        const activeToken = {
            token: Utils.trim(this.state.activeToken),
            balance: balances[this.state.activeToken].toLocaleString()
        };

        const renderToken = ({ index, item }) => {
            const style = {};
            let color = '#ffffff';

            if(index == 0)
                style.marginLeft = scale(12.5);

            if((index + 1) == mappedBalances.length)
                style.marginRight = scale(12.5);

            if(mappedBalances[index].token == this.state.activeToken) {
                style.backgroundColor = '#ffffff';
                color = '#000000';
            }

            return (
                <View style={[ styles.tokenStyle, style ]}>
                    <Text style={{ color, fontFamily: 'source-code-pro', fontSize: scale(16) }}>
                        { item.balance }
                    </Text>
                    <Text style={{ color, fontFamily: 'source-code-pro', fontWeight: '900', fontSize: scale(19) }}>
                        { Utils.trim(item.token) }
                    </Text>
                </View>
            );
        };

        return (
            <View style={{ paddingBottom: scale(16.5), marginTop: scale(-20), alignItems: 'center' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: scale(30), paddingBottom: scale(30) }}>
                    <Text style={{ fontFamily: 'source-code-pro', fontSize: scale(30), fontWeight: '500', color: '#eeeeee', textAlign: 'center' }}>
                        { activeToken.balance } { activeToken.token }
                    </Text>                    
                </View>
                <FlatList data={ mappedBalances } renderItem={ ({ item, index }) => (
                    <TouchableOpacity key={ item.token } onPress={ () => this.setState({ activeToken: item.token }) }>
                        { renderToken({ index, item }) }                           
                    </TouchableOpacity>
                )} horizontal={ true } showsHorizontalScrollIndicator={ false }/>
            </View>
        );
    }

    filterView() {
        return <DateFilter startDate={ this.state.startDate } endDate={ this.state.endDate } onChange={ this.filterTransactions } />;
    }

    filterTransactions({ startDate, endDate }) {
        this.setState({ startDate, endDate });
    }

    formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        const months = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    }

    navigateToTransaction(transactionID) {
        const { walletID } = this.state;
        this.props.navigation.navigate('TransactionView', { walletID, transactionID });
    }

    transactionView() {
        const { wallet, walletID } = this.state;

        const transactions = wallet.transactions.filter(({ token , timestamp}) => {
            return token == this.state.activeToken;
        }).sort((a, b) => b.timestamp - a.timestamp).map(transaction => {
            const { direction, amount, token, timestamp, transactionID } = transaction;

            if(this.state.startDate && transaction.timestamp < this.state.startDate)
                return null;

            if(this.state.endDate && transaction.timestamp > this.state.endDate)
                return null;

            const colours = {
                text: direction == 'out' ? '#ED3F23' : '#50E3C2',
                prefix: direction == 'out' ? '-' : '+',
                direction: direction == 'out' ? 'Sent' : 'Received'
            }

            if(direction == 'out')
                colours.imageUri = require('app/assets/images/transaction-sent.png');
            else colours.imageUri = require('app/assets/images/transaction-received.png');

            return (
                <TouchableOpacity 
                    key={ transactionID }
                    onPress={ () => this.navigateToTransaction(transactionID) } 
                    style={[ styles.transactionContainer, { backgroundColor: this.props.utils.theme.cardBackground } ]
                }>
                    <Image source={ colours.imageUri } fadeDuration={ 0 } style={ styles.transactionIcon } />
                    <Text style={{ fontSize: scale(20), color: '#ffffff' }}>{ colours.direction }</Text>
                    <View style={{ flexDirection: 'column', flex: 1 }}>
                        <Text style={{ textAlign: 'right', fontSize: scale(15), paddingBottom: scale(3), color: colours.text }}>
                            { colours.prefix } { amount.toLocaleString() } { Utils.trim(token) }
                        </Text>
                        <Text style={{ textAlign: 'right', color: '#eeeeee', fontSize: scale(15) }}>
                            { this.formatTimestamp(timestamp) }
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });

        return transactions;
    }

    deleteAccount() {
        const processDelete = () => {
            Utils.reducers.deleteAccount(this.state.walletID);
            this.props.navigation.navigate('ListView');
        }

        const onConfirmation = () => {
            Alert.alert(
                'Are you sure?',
                'We cannot undo this action if you have lost your wallet seed',
                [
                    { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                    { text: 'Yes', onPress: () => { processDelete() } }
                ]
            );
        }

        Alert.alert(
            'Delete Confirmation',
            'Are you sure you want to delete ' + this.state.wallet.name + '?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => { onConfirmation() } }
            ]
        );
    }

    render() {
        const { wallet, walletID } = this.state;

        return (
            <View style={{ flex: 1 }}>
                <LinearGradient 
                    start={[ 1, 0 ]} 
                    end={[ 0, 0 ]} 
                    colors={ this.props.utils.theme.highlightGradient } 
                    style={{ 
                        marginTop: -this.props.utils.statusHeight, 
                        paddingTop: this.props.utils.statusHeight, 
                        backgroundColor: '#eeeeee' 
                    }}
                >
                    <Header title={ wallet.name } leftButton={ this.headerButtons.left } rightButton={ this.headerButtons.right } />
                    { this.balanceView() }
                </LinearGradient>
                <ScreenView style={{ flex: 1 }}>
                    <View style={{ padding: scale(16.5), paddingBottom: 0, flex: 1 }}>
                        { this.filterView() }
                        { this.transactionView() }  
                    </View>   
                </ScreenView>
                <Menu 
                    style={ styles.menu }
                    open={ this.state.isMenuOpen } 
                    hide={ () => this.toggleMenu() } 
                    items={[ 
                        {
                            icon: {
                                type: MaterialIcons,
                                name: 'send'
                            },
                            title: 'Send',
                            onPress: () => { this.openSendView() },
                        }, 
                        {
                            icon: {
                                type: MaterialCommunityIcons,
                                name: 'qrcode'
                            },
                            title: 'Receive',
                            onPress: () => { this.props.navigation.navigate('ReceiveView', { accountID: this.state.walletID }) },
                        },
                        {
                            icon: {
                                type: FontAwesome,
                                name: 'snowflake-o'
                            },
                            title: 'Freeze',
                            onPress: () => { this.openFreezeView() },
                        },
                        {
                            icon: {
                                type: MaterialCommunityIcons,
                                name: 'white-balance-sunny'
                            },
                            title: 'Unfreeze',
                            onPress: () => { this.unfreeze() },
                        },
                        {
                            icon: {
                                type: MaterialCommunityIcons,
                                name: 'delete'
                            },
                            title: 'Delete Wallet',
                            onPress: () => { this.deleteAccount() }
                        }
                    ]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menu: {
        position: 'absolute',
        top: 70,
        right: 0,
        left: 0,
        bottom: 0
    },
    filterContainer: {
        marginBottom: scale(8),
        borderRadius: 5,
        borderWidth: 3,
        borderColor: '#ffffff0d',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    filterText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: scale(16),
        padding: scale(12.5)
    },
    transactionContainer: {
        width: '100%',
        borderRadius: 5,
        flexDirection: 'row',
        marginBottom: scale(4),
        padding: scale(11),
        alignItems: 'center',
        paddingLeft: scale(20),
        paddingRight: scale(20)
    },
    transactionIcon: {
        marginRight: scale(20),
        width: scale(20),
        height: scale(20)
    },
    tokenStyle: {
        padding: scale(11), 
        alignItems: 'center', 
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        borderRadius: 5, 
        marginLeft: scale(4), 
        marginRight: scale(4), 
        paddingLeft: scale(20), 
        paddingRight: scale(20)
    }
});

export default connect(state => ({ 
    app: state.app,
    wallets: state.wallets.accounts, 
    utils: state.utils,
    contacts: state.contacts
}), dispatch => ({
    setStatusBarColor: color => {
        dispatch(setStatusBarColor(color))
    } 
}))(DetailedView);