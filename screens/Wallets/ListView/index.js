import React from 'react';

import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { Haptic } from 'expo';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';

import ScreenView from 'app/components/ScreenView';

import { Header, HeaderButton } from 'app/components/Header';
import BasicView from './BasicView';
import Menu from 'app/components/Menu';

import { Utils } from 'app/config';

class ListView extends React.Component {
    state = {
        isMenuOpen: false
    }

    headerButtons = {
        right: <HeaderButton icon='add' onPress={ () => this.toggleMenu() } />
    }

    constructor(props) {
        super(props);

        this.toggleMenu = this.toggleMenu.bind(this);
        this.walletPress = this.walletPress.bind(this);
    }
    
    toggleMenu() {
        if(this.state.isMenuOpen)
            Utils.feedback();

        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    walletPress(walletID) {
        this.props.navigation.navigate('DetailedView', { walletID });
        Utils.feedback();
    }

    render() {
        const wallets = Object.keys(this.props.wallets).map((walletID, index) => {
            return (
                <TouchableWithoutFeedback key={ walletID } onPress={ () => this.walletPress(walletID) }>
                    <View>
                        <BasicView walletID={ walletID } />
                    </View>
                </TouchableWithoutFeedback>          
            );
        });

        return (
            <View style={{ flex: 1 }}>
                <Header title='Wallet' rightButton={ this.headerButtons.right } />
                <ScreenView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>                        
                        <View style={{ padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                            { wallets }
                        </View>
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
                                name: 'account-balance-wallet'
                            },
                            title: 'New Wallet',
                            onPress: () => { this.props.navigation.navigate('WalletNameView') },
                        }, 
                        {
                            icon: {
                                type: MaterialIcons,
                                name: 'file-download'
                            },
                            title: 'Import Wallet',
                            onPress: () => { this.props.navigation.navigate('ImportType') },
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
    }
})

export default connect(state => ({ 
    wallets: state.wallets.accounts 
}))(ListView);