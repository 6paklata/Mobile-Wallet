import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Utils } from 'app/config';

class BasicView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            walletID: this.props.walletID,
            wallet: this.props.wallets[this.props.walletID]
        };
    }

    render() {
        const { wallet, walletID } = this.state;

        // TODO: Get abbreviations from token reducer

        const balances = Object.entries(wallet.balances).sort((a, b) => b[1] - a[1]).map(([ name, amount ], index) => {
            return (
                <View key={ name } style={ styles.balance }>
                    <Text style={ styles.balanceAmount }>
                        { amount.toLocaleString() } 
                    </Text>
                    <Text style={ styles.balanceName } numberOfLines={ 1 }>
                        { Utils.trim(name, 15) }
                    </Text>
                </View>
            );     
        });

        return (
            <View style={[ styles.container, { backgroundColor: this.props.utils.theme.cardBackground } ]}>                
                <View style={ styles.partition }>
                    <Text style={ styles.accountName }>
                        { wallet.name }
                    </Text>
                    <View style={ styles.balanceContainer }>
                        { balances }
                    </View>         
                </View>       
                <View style={ styles.pointerContainer }>
                    <MaterialIcons
                        name='play-arrow'
                        style={ styles.walletPointer }
                    />
                </View>                
            </View>          
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        padding: 15
    },
    partition: {
        flex: 1
    },
    balanceContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: -5
    },
    pointerContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 15
    },
    walletPointer: {
        color: '#ffffff',
        fontSize: 20
    },
    accountName: {
        fontSize: 18,
        color: 'white',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    balance: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 5,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 6,
        paddingBottom: 6,
        flexDirection: 'row',
        margin: 5
    },
    balanceAmount: { 
        color: '#eeeeee', 
        fontSize: 16,
        paddingRight: 6
    },
    balanceName: { 
        color: '#aaaaaa', 
        fontSize: 16 
    }
});

export default connect(state => ({ 
    wallets: state.wallets.accounts, 
    utils: state.utils 
}))(BasicView);