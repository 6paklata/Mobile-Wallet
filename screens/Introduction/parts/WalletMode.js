import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class WalletMode extends React.Component {
    state = {
        walletMode: 'hot'
    }

    choose(walletMode) {
        this.setState({ walletMode });
    }

    advanceScreen() {
        this.props.navigation.navigate('WalletCreation', { walletMode: this.state.walletMode });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>            
                <View style={ styles.background }>                    
                    <Image style={ styles.backgroundImage } source={ require('app/assets/images/introduction/mode-background.png')} resizeMode='contain' />
                </View>  
                <SafeView style={ styles.safeView }>
                    <View style={ styles.walletMode }>
                        <TouchableWithoutFeedback onPress={ () => this.choose('hot') }>
                            <View style={[ styles.wallet, styles.topWallet ]}>
                                <LinearGradient colors={ this.props.utils.theme.highlightGradient } style={ styles.checkbox }>
                                    <View style={ styles.checkboxIcon }>
                                        { this.state.walletMode == 'hot' && <View style={ styles.checkmark }></View> }
                                    </View>
                                </LinearGradient>
                                <View style={ styles.walletInfo }>
                                    <Text style={ styles.walletInfoHeader }>HOT WALLET:</Text>
                                    <View style={ styles.listItem }>
                                        <Text style={ styles.listItemBullet }>{'\u2022'}</Text>
                                        <Text style={ styles.listItemContent }>Send and receive Tron immediately</Text>
                                    </View>
                                    <View style={ styles.listItem }>
                                        <Text style={ styles.listItemBullet }>{'\u2022'}</Text>
                                        <Text style={ styles.listItemContent }>Manage all your Tron accounts, tokens and votes</Text>
                                    </View>
                                    <View style={ styles.listItem }>
                                        <Text style={ styles.listItemBullet }>{'\u2022'}</Text>
                                        <Text style={ styles.listItemContent }>Transactions are signed on your device and broadcasted to the network</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={ () => this.choose('cold') }>
                            <View style={[ styles.wallet, styles.bottomWallet ]}>
                                <LinearGradient colors={ this.props.utils.theme.highlightGradient } style={ styles.checkbox }>
                                    <View style={ styles.checkboxIcon }>
                                        { this.state.walletMode == 'cold' && <View style={ styles.checkmark }></View> }
                                    </View>
                                </LinearGradient>
                                <View style={ styles.walletInfo }>
                                    <Text style={ styles.walletInfoHeader }>COLD WALLET:</Text>
                                    <View style={ styles.listItem }>
                                        <Text style={ styles.listItemBullet }>{'\u2022'}</Text>
                                        <Text style={ styles.listItemContent }>Sign transactions without an active internet connection</Text>
                                    </View>
                                    <View style={ styles.listItem }>
                                        <Text style={ styles.listItemBullet }>{'\u2022'}</Text>
                                        <Text style={ styles.listItemContent }>Broadcast transactions using a different device for the best possible security</Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <TouchableOpacity style={ styles.button } onPress={ () => this.advanceScreen() }>
                        <Text style={ styles.buttonText }>Go to { this.state.walletMode } wallet</Text>
                    </TouchableOpacity>
                </SafeView>
                <View style={ styles.footer }>
                    <View style={ styles.footerInactive }></View>
                    <LinearGradient 
                        colors={ this.props.utils.theme.highlightGradient } 
                        start={[ 1, 0 ]} 
                        end={[ 0, 0 ]} 
                        style={[ styles.footerInactive, styles.footerActive ]}
                    />
                    <View style={ styles.footerInactive }></View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center', 
        justifyContent: 'center'
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        opacity: 0.4
    },
    safeView: {
        flex: 1, 
        paddingTop: Utils.statusBarOffset,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    footerInactive: {
        height: 11,
        width: 11,
        borderRadius: 11,
        backgroundColor: '#0B0F12',
        marginLeft: 10,
        marginRight: 10
    },
    footerActive: {
        width: 31,
        backgroundColor: '#ED3F21',
        marginLeft: 0,
        marginRight: 0
    },
    header: {
        color: '#ffffff',
        fontSize: 22,
        flexWrap: 'wrap',
        maxWidth: '80%',
        textAlign: 'center',
        fontWeight: '500',
        marginTop: 10
    },
    button: {
        width: '80%',
        backgroundColor: '#0B0F12',
        borderRadius: 5,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    walletMode: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 5,
        marginTop: 40,
        width: '80%'
    },
    wallet: {
        padding: 20,
        flexDirection: 'row',
    },
    topWallet: {
        borderBottomWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    checkbox: {
        height: 30,
        width: 30,
        borderRadius: 6,
        padding: 3,
        marginRight: 20
    },
    checkboxIcon: {
        flex: 1,
        backgroundColor: '#262D34',     
        borderRadius: 4
    },
    checkmark: {
        backgroundColor: '#ffffff',
        flex: 1,
        borderRadius: 2,
        margin: 4
    },
    walletInfo: {
        flex: 1,
        paddingRight: 30
    },
    walletInfoHeader: {
        height: 30,
        color: '#ffffff',
        fontSize: 19,
        width: '100%',
        lineHeight: 33,
        fontWeight: '500',
        marginBottom: 10
    },
    listItem: {
        flexDirection: 'row'
    },
    listItemBullet: {
        color: '#ffffff',
        marginRight: 20
    },
    listItemContent: {
        color: '#ffffff',
        fontSize: 16,
        flexWrap: 'wrap',
        marginBottom: 7
    }
});

export default connect(state => state)(WalletMode);