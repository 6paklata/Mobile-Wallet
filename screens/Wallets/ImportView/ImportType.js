import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Animated } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import { MaterialIcons } from '@expo/vector-icons';

import { Header, HeaderButton } from 'app/components/Header';
import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class ImportType extends React.Component {
    state = {
        colours: {
            minText: new Animated.Value(1),
            maxText: new Animated.Value(0),
            characters: new Animated.Value(0),
            spaces: new Animated.Value(0),
            unique: new Animated.Value(0)
        },
        validationError: true,
        walletName: ''
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.props.navigation.navigate('ListView') } />,
    }

    advanceScreen(nextScreen) {
        this.props.navigation.navigate('WalletNameView', {
            nextScreen,
        });
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Create Wallet' } leftButton={ this.headerButtons.left } />
                <View style={{ flex: 1, padding: 40, alignItems: 'center', justifyContent: 'center', paddingBottom: this.props.utils.footerHeight }}>                    
                    <TouchableOpacity style={ styles.button } onPress={ () => this.advanceScreen('WordList') } >
                        <Text style={ styles.buttonText }>Import from Word List</Text>

                        <MaterialIcons
                            name='arrow-forward'
                            color='white'
                            style={{ fontSize: 28 }} />
                    </TouchableOpacity>

                    <TouchableOpacity style={ styles.button } onPress={ () => this.advanceScreen('PrivateKey') } >
                        <Text style={ styles.buttonText }>Import from Private Key</Text>

                        <MaterialIcons
                            name='arrow-forward'
                            color='white'
                            style={{ fontSize: 28 }} />
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        width: '100%',
        backgroundColor: '#0B0F1299',
        borderRadius: 5,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    },
});

export default connect(state => state)(ImportType);