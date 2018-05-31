import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Animated } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class WalletCreation extends React.Component {
    state = {
        colours: {
            minText: new Animated.Value(1),
            maxText: new Animated.Value(0),
            characters: new Animated.Value(0),
            spaces: new Animated.Value(0)
        },
        validationError: true,
        walletMode: '',
        walletName: ''
    }

    componentWillMount() {
        this.setState({ walletMode: this.props.navigation.state.params.walletMode });
    }

    advanceScreen() {
        this.props.navigation.navigate('PasswordSetup', { 
            walletMode: this.state.walletMode,
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
            })
        };

        return (
            <View style={{ flex: 1 }}>            
                <View style={ styles.background }>                    
                    <Image style={ styles.backgroundImage } source={ require('app/assets/images/introduction/name-background.png')} resizeMode='contain' />
                </View>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={ 'padding' }>
                    <SafeView style={ styles.safeView }>
                        <Image source={ require('app/assets/images/introduction/name-graphic.png') } style={ styles.image } resizeMode='contain' />
                        <View>
                            <Text style={ styles.header }>Name your first wallet</Text>
                            <View style={ styles.content }>
                                <Text style={ styles.contentText }>
                                    <Animated.Text style={{ color: colours.minText }}>Wallet names must have at least 3 characters</Animated.Text>
                                    <Text>, </Text>
                                    <Animated.Text style={{ color: colours.maxText }}>be no longer than 32 characters </Animated.Text>
                                    <Text>and </Text>
                                    <Animated.Text style={{ color: colours.characters }}>only contain letters, numbers and spaces</Animated.Text>
                                    <Text>. </Text>
                                    <Animated.Text style={{ color: colours.spaces }}>Names cannot begin or end with a space</Animated.Text>
                                    <Text>.</Text>
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
                            <Text style={[ styles.buttonText, this.state.validationError && styles.buttonTextDisabled ]}>Create { this.state.walletMode } wallet</Text>
                        </TouchableOpacity>
                    </SafeView>
                </KeyboardAvoidingView>
                <View style={ styles.footer }>
                    <View style={ styles.footerInactive }></View>
                    <View style={ styles.footerInactive }></View>
                    <LinearGradient 
                        colors={ this.props.utils.theme.highlightGradient } 
                        start={[ 1, 0 ]} 
                        end={[ 0, 0 ]} 
                        style={[ styles.footerInactive, styles.footerActive ]}
                    />
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
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        flex: 1,
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
    image: {
        maxWidth: '60%',
        aspectRatio: 1,
        display: 'none'
    },
    header: {
        color: '#ffffff',
        fontSize: 22,
        flexWrap: 'wrap',
        maxWidth: '80%',
        textAlign: 'center',
        fontWeight: '500',
        marginTop: -20,
        marginBottom: 15
    },
    content: {
        width: '80%',
        maxWidth: '80%',                
        marginBottom: 20,        
        flexDirection: 'row'
    },
    contentText: {
        fontSize: 18,
        color: '#dddddd',
        flexWrap: 'wrap',
        textAlign: 'center',
    },
    button: {
        width: '80%',
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
        width: '80%',
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

export default connect(state => state)(WalletCreation);