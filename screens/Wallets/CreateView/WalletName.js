import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Animated } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';
import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class WalletName extends React.Component {
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

    advanceScreen() {
        const nextScreen = this.props.navigation.state.params ? this.props.navigation.state.params.nextScreen : 'WordListView';
        this.props.navigation.navigate(nextScreen, {
            walletName: this.state.walletName
        });        
    }    

    setFlag(name, boolean) {
        Animated.timing(this.state.colours[name], { toValue: +boolean, duration: 150 }).start();

        if(boolean)
            this.setState({ validationError: true });
    }

    setName(walletName) {
        this.setState({ walletName });
        this.setState({ validationError: false });

        this.setFlag('minText', walletName.length < 3);
        this.setFlag('maxText', walletName.length > 32);
        this.setFlag('characters', walletName.length && !/^([A-Za-z0-9 ]+)$/.test(walletName));
        this.setFlag('spaces', /\s/.test(walletName.charAt(0)) || /\s/.test(walletName.charAt(walletName.length - 1)));
        this.setFlag('unique', Object.values(this.props.wallets.accounts).some(({ name }) => name.toLowerCase() == walletName.toLowerCase()));
    }

    render() {
        const COLOR_CONSTANTS = [ '#dddddd', '#d72b3f' ];
        const colours = {
            minText: this.state.colours.minText.interpolate({
                inputRange: [ 0, 1 ],
                outputRange: COLOR_CONSTANTS
            }),
            maxText: this.state.colours.maxText.interpolate({
                inputRange: [ 0, 1 ],
                outputRange: COLOR_CONSTANTS
            }),
            characters: this.state.colours.characters.interpolate({
                inputRange: [ 0, 1 ],
                outputRange: COLOR_CONSTANTS
            }),
            spaces: this.state.colours.spaces.interpolate({
                inputRange: [ 0, 1 ],
                outputRange: COLOR_CONSTANTS
            }),
            unique: this.state.colours.unique.interpolate({
                inputRange: [ 0, 1 ],
                outputRange: COLOR_CONSTANTS
            })
        };

        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Create Wallet' } leftButton={ this.headerButtons.left } />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: this.props.utils.footerHeight }}>                    
                    <KeyboardAvoidingView style={{ flex: 1, width: '80%', maxWidth: '100%', alignItems: 'center', justifyContent: 'center' }} behavior={ 'padding' }>
                        <View style={{ width: '100%' }}>
                            <Text style={ styles.header }>Name your wallet</Text>
                            <View style={ styles.content }>
                                <Text style={ styles.contentText }>
                                    <Animated.Text style={{ color: colours.minText }}>Wallet names must have at least 3 characters</Animated.Text>
                                    <Text>, </Text>
                                    <Animated.Text style={{ color: colours.maxText }}>be no longer than 32 characters </Animated.Text>
                                    <Text>and </Text>
                                    <Animated.Text style={{ color: colours.characters }}>only contain letters, numbers and spaces</Animated.Text>
                                    <Text>. </Text>
                                    <Animated.Text style={{ color: colours.spaces }}>Names cannot begin or end with a space</Animated.Text>
                                    <Text>. </Text>
                                    <Animated.Text style={{ color: colours.unique }}>Names must not be in use by another local wallet</Animated.Text>
                                    <Text>. </Text>
                                </Text>
                            </View>
                        </View>
                        <View style={ styles.walletName }>
                            <TextInput 
                                style={ styles.walletNameInput } 
                                placeholder={ 'Wallet name' } 
                                placeholderTextColor={ '#898989' } 
                                underlineColorAndroid={ 'transparent' } 
                                onChangeText={ walletName => this.setName(walletName) }
                                maxLength={ 33 } // So we can have cool red text for > 32 chars
                                returnKey={ 'next' }
                            />
                        </View>
                        <TouchableOpacity 
                            style={[ styles.button, this.state.validationError && styles.buttonDisabled ]} 
                            onPress={ () => this.advanceScreen() } 
                            disabled={ !!this.state.validationError }
                        >
                            <Text style={[ styles.buttonText, this.state.validationError && styles.buttonTextDisabled ]}>Create { this.props.app.walletMode } wallet</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        color: '#ffffff',
        fontSize: 22,
        flexWrap: 'wrap',
        maxWidth: '100%',
        width: '100%',
        textAlign: 'center',
        fontWeight: '500',
        marginBottom: 15
    },
    content: {
        width: '100%',
        maxWidth: '100%',                
        marginBottom: 20,        
        flexDirection: 'row',
    },
    contentText: {
        fontSize: 18,
        color: '#dddddd',
        flexWrap: 'wrap',
        textAlign: 'center',
        width: '100%'
    },
    button: {
        width: '100%',
        backgroundColor: '#0B0F12',
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
    walletName: {        
        width: '100%',
        marginTop: 10,
        backgroundColor: 'rgba(250, 250, 250, 0.1)',
        borderRadius: 5,
        height: 50
    },
    walletNameInput: {
        paddingLeft: 17,
        paddingRight: 17,
        height: 50,
        color: '#ffffff',
        fontSize: 16,
        width: '100%'
    }
});

export default connect(state => state)(WalletName);