import React from 'react';

import { LinearGradient, DangerZone } from 'expo';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { Utils } from 'app/config';

import Fade from 'app/components/Fade';

const { Lottie } = DangerZone;
const progressBar = require('app/assets/animations/passwordProgressBar.json');

export default class Password extends React.Component {
    state = {
        mode: this.props.mode,
        text: this.props.text, // 'This is a very long error that should span multiple lines'
        enteredPassword: '',
        loading: false
    }

    componentWillReceiveProps(newProps) {
        if(newProps.mode !== this.state.mode)
            this.setState({ mode: newProps.mode });

        if(newProps.text !== this.state.text)
            this.setState({ text: newProps.text });
    }

    onPressKey(digit) {
        const enteredPassword = this.state.enteredPassword + String(digit);

        if(enteredPassword.length == this.state.mode && this.props.onPassword)
            this.props.onPassword(enteredPassword);

        this.setState({ enteredPassword });
    }

    onPressDelete() {
        this.setState({ 
            enteredPassword: this.state.enteredPassword.substring(0, this.state.enteredPassword.length - 1)
        });
    }

    onPressClear() {
        this.setState({ enteredPassword: '' });
    }

    clear() {
        this.onPressClear();
    }

    toggleLoading() {
        const loading = !this.state.loading;

        if(loading)
            this.progressBar.play();
        else setTimeout(() => {
            if(!this.progressBar)
                return;
                
            if(!this.state.loading) // Check in case toggleLoading has been called again
                this.progressBar.progress = 0;
        }, 300);

        this.setState({ loading });
    }

    changeMode() {
        const newMode = this.state.mode == 4 ? 6 : 4;
    
        this.setState({ 
            enteredPassword: '',
            mode: newMode
        });

        if(this.props.onReset)
            this.props.onReset(newMode);
    }

    keypad() {
        const modeChangeable = typeof this.props.modeChangeable == 'boolean' ? this.props.modeChangeable : true;
        const keys = [ [], [], [] ];

        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                const digit = x * 3 + y + 1;

                keys[x].push(
                    <TouchableOpacity disabled={ this.state.enteredPassword.length == this.state.mode } style={ styles.keypadKey } key={ y } onPress={ () => this.onPressKey(digit) }>
                        <Text style={ styles.keypadText }>{ digit }</Text>
                    </TouchableOpacity>     
                );
            }
        }

        return (
            <View style={ styles.inputContainerBackground }>
                { modeChangeable && <TouchableOpacity disabled={ this.state.loading } onPress={ () => this.changeMode() }>
                    <View style={[ styles.modeChange, { opacity: Number(!this.state.loading)} ]}>
                        <Text style={ styles.modeChangeText }>
                            Switch to { this.state.mode == 4 ? 6 : 4 } digits
                        </Text>
                    </View>
                </TouchableOpacity> }
                <View style={[ styles.keypadContainer, { opacity: Number(!this.state.loading) } ]}>                   
                    { keys.map((row, index) => {
                        return (
                            <View key={ index } style={ styles.keypadRow }>
                                { row }
                            </View>
                        )
                    }) }
                    <View style={ styles.keypadRow }>
                        <TouchableOpacity disabled={ !this.state.enteredPassword.length } style={ styles.keypadKey } onPress={ () => this.onPressClear() }>
                            <Text style={[ styles.keypadText, { fontSize: 17 } ]}>CLEAR</Text>
                        </TouchableOpacity>
                        <TouchableOpacity disabled={ this.state.enteredPassword.length == this.state.mode } style={ styles.keypadKey } onPress={ () => this.onPressKey(0) }>
                            <Text style={ styles.keypadText }>0</Text>
                        </TouchableOpacity>         
                        <TouchableOpacity disabled={ !this.state.enteredPassword.length } style={ styles.keypadKey } onPress={ () => this.onPressDelete() }>
                            <Feather style={ styles.keypadText } name='delete' />
                        </TouchableOpacity>                        
                    </View>
                </View>
                <View style={[ styles.keypadOverlay, { opacity: Number(this.state.loading) } ]} pointerEvents={ this.state.loading ? 'auto' : 'none'}>
                    <Lottie ref={ animation => {
                        this.progressBar = animation;
                    }} source={ progressBar } />
                </View>
            </View>
        );
    }

    render() {
        const theme = this.props.theme;
        const digits = new Array(this.state.mode).fill(0).map((_, index) => {
            const filled = index < this.state.enteredPassword.length;

            return (
                <View key={ index } style={ styles.digit }>
                    <View style={[ styles.dot, filled ? styles.dotFilled : {} ]} />
                </View>
            );
        });

        return (
            <View style={[ styles.container, { top: Utils.statusBarHeight } ]}>
                <View style={ styles.passwordContainer }>
                    <View style={ styles.text }>
                        <Text style={[ styles.textContent, this.state.text.error.length && styles.textContentError ]}>
                            { this.state.text.error || this.state.text.info }
                        </Text>
                    </View>
                    <View style={ styles.digitContainer }>
                        { digits }                
                    </View>
                </View>
                <View style={ styles.inputContainer }>
                    { this.keypad() }
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end'
    },
    passwordContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1
    },
    inputContainer: {
        width: '100%',
        padding: 30
    },
    inputContainerBackground: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 10
    },
    text: {    
        width: '80%',
        paddingBottom: 15
    },
    textContent: {
        flexWrap: 'wrap',
        textAlign: 'center',
        color: '#dddddd',
        fontSize: 20,
        maxWidth: '100%'
    },
    textContentError: {
        color: '#d72b3f'
    },
    button: {
        marginTop: 20,
        height: 60,
        borderRadius: 4,
        alignItems: 'center',
        width: '100%',
        justifyContent: 'center'
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 17,        
        textAlign: 'center'
    },
    digitContainer: {
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    digit: {
        height: 30,
        width: 30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dot: {
        width: 17,
        height: 17,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#cccccc'
    },
    dotFilled: {
        backgroundColor: '#cccccc'
    },
    keypadContainer: {
        padding: 15
    },
    keypadRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    },
    keypadKey: {
        flex: 1,
        paddingTop: 25,
        paddingBottom: 25,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        margin: 6,
    },
    keypadText: {
        fontSize: 22,
        color: '#ffffff'
    },
    keypadOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    modeChange: {
        width: '100%',        
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 20
    },
    modeChangeText: {
        color: '#ffffff',
        fontWeight: '500',
        textAlign: 'center',
        fontSize: 18,
    }
});