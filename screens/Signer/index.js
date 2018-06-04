import React from 'react';
import moment from 'moment';
import DatePicker from 'react-native-datepicker'

import { connect } from 'react-redux';
import { Platform, Text, StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, TextInput, KeyboardAvoidingView, Picker, Clipboard } from 'react-native';
import { LinearGradient, Linking, WebBrowser } from 'expo';

import ScreenView from 'app/components/ScreenView';
import LocalError from 'app/components/LocalError';
import Dropdown from 'app/components/Dropdown';
import StyledInput from 'app/components/StyledInput';

import { Header, HeaderButton } from 'app/components/Header';
import { Utils } from 'app/config';

import initialState from './initialState';

const { scale } = Utils;

class SignerView extends React.Component {
    state = { 
        ...initialState 
    };

    constructor(props) {
        super(props);

        this.onInput = this.onInput.bind(this);
    }

    componentWillMount() {
        this.calculateErrors();
        
        const contractType = this.props.navigation.state.params ? this.props.navigation.state.params.contract : false;

        if(contractType) {
            this.setState({
                contractType
            });
        }

        this.setState({
            walletUUID: Object.keys(this.props.wallets.accounts)[0],
        });
    }

    async submit() {
        const {
            publicKey,
            privateKey
        } = this.props.wallets.accounts[this.state.walletUUID];

        const recentBlockBase64 = this.state.inputs.recentBlockBase64;
        const contractType = this.state.contractType;

        try {
            const signature = await Utils.node.offlineSignature({ publicKey, privateKey }, recentBlockBase64, contractType, this.state.inputs);
            
            this.setState({
                outputHex: Utils.toHexString(signature.serializeBinary()),
            });
        } catch (error) {
            console.log(error);
        }
    }

    calculateErrors() {
        const errors = [];

        const {

        } = this.state.inputs;

        this.setState({ errors });
    }

    onInput({ stateKey, value }) {
        console.log(`Set input: ${ stateKey }, ${ value }`);

        this.setState({
            inputs: {
                ...this.state.inputs,
                [stateKey]: value
            }                    
        });

        setTimeout(() => {
            this.calculateErrors();
        }, 0);
    }

    getContractTypes() {
        return Object.entries(this.state.types).reduce((types, [ contractType, { name } ]) => {
            return [ ...types, { label: name, value: contractType } ];
        }, []);
    }

    getWalletOptions() {
        return Object.entries(this.props.wallets.accounts).reduce((wallets, [ uuid, { name } ]) => {
            return [ ...wallets, { label: name, value: uuid } ]; 
        }, []);
    }

    setDate(stateKey, date) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                [stateKey]: date,
            }
        });
    }

    copyOutput() {
        Clipboard.setString(this.state.outputHex);
    }

    form() {
        const inputs = this.state.types[this.state.contractType].inputs;

        return Object.entries(inputs).map(([ key, { text, type, label, misc } ]) => {
            const exchangeValue = Math.max(1, (this.state.inputs.exchangeToken || 1) / (this.state.inputs.exchangeTRX || 10));

            return (
                <View key={ key } style={ styles.inputContainer }>
                    <Text style={ styles.inputContainerLabel }>{ label }</Text>
                    
                    { (type == 'default' || type == 'numeric') &&
                        <StyledInput input={ text } stateKey={ key } type={ type } onInput={ this.onInput } />
                    }

                    { type == 'dropdown' &&
                        <View>
                            <Dropdown
                                options={ misc.options }
                                value={ this.inputs[key] || false }
                                onChange={ value => this.onInput({ stateKey: key, value }) } 
                            />
                            { (this.state.inputs[key] && this.state.inputs[key] != 'tron') &&
                                <StyledInput input={ 'Token Name' } stateKey={ key } type={ type } onInput={ this.onInput } />
                            }
                        </View>
                    }

                    { type == 'exchange' &&
                        <View>
                            <Text style={ styles.inputContainerLabel }>
                                You will receive { exchangeValue } tokens for every 1 TRX
                            </Text>

                            <View style={ styles.inputFlexContainer }>
                                <StyledInput input={ '1 TRX' } stateKey={ 'exchangeTRX' } flex onInput={ this.onInput } />
                                <Text style={ styles.inputFlexSeparator }>to</Text>
                                <StyledInput input={ '10 Token' } stateKey={ 'exchangeToken' } flex onInput={ this.onInput } />
                            </View>
                        </View>
                    }

                    {
                        type == 'date' && 
                        <DatePicker
                            date={ this.state.inputs[key] }
                            mode='date'
                            placeholder={ this.state.inputs[key] }
                            format='MMM D, YYYY'
                            onDateChange={ (date) => this.setDate(key, date) }
                            customStyles={{
                                dateTouchBody: {
                                    width: '100%',
                                },
                                dateIcon: {
                                    height: 0,
                                    width: 0,
                                },
                                dateInput: {
                                    width: '100%',
                                    padding: 15,
                                    alignItems: 'center',
                                    backgroundColor: 'rgba(255, 255, 255, 0.05)',        
                                    borderRadius: 5,
                                    borderWidth: 0,
                                },
                                dateText: {
                                    color: 'white',
                                }
                            }}
                        />
                    }

                </View>
            );
        });
    }

    setContractType(contractType) {
        this.setState({
            ...initialState,
            contractType
        });
    }

    getRecentBlockEncoding() {
        const url = 'https://google.com'; // TODO

        if(this.props.utils.walletMode == 'hot')
            return WebBrowser.openBrowserAsync(url);

        Linking.openURL(url);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Signer' } />
                <KeyboardAvoidingView style={ styles.container } behavior={ 'padding' }>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>                        
                            <View style={ styles.inputContainer }>
                                <Text style={ styles.inputContainerLabel }>
                                    Which contract type are you looking for?
                                </Text>                                
                                <Dropdown
                                    options={ this.getContractTypes() }
                                    value={ this.state.contractType }
                                    onChange={ contractType => this.setContractType(contractType) } 
                                />
                            </View>
                            <View style={ styles.inputContainer }>
                                <Text style={ styles.inputContainerLabel }>
                                    Which wallet will the transaction occur from?
                                </Text>                                
                                <View style={ styles.pickerContainer }>
                                    <Dropdown
                                        options={ this.getWalletOptions() }
                                        value={ this.state.walletUUID }
                                        onChange={ walletUUID => this.setState({ walletUUID }) } 
                                    />
                                </View>
                            </View>

                            { this.form() }

                            <View style={ styles.inputContainer }>
                                <TouchableWithoutFeedback onPress={ () => this.getRecentBlockEncoding() }>
                                    <View>
                                        <Text style={ styles.inputContainerLabel }>
                                            What is the base 64 encoding of a recent block? Click here to find one.
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <StyledInput input={ 'Recent Block' } stateKey={ 'recentBlockBase64' } onInput={ this.onInput } />
                            </View>

                            <TouchableOpacity onPress={ () => this.submit() }>
                                <View style={ styles.button }>
                                    <Text style={ styles.buttonText }>Sign Transaction</Text>
                                </View>
                            </TouchableOpacity>

                            { this.state.outputHex.length > 0 &&
                                <View style={ [ styles.inputContainer, { marginTop: 16.5 } ] }>
                                    <Text style={ styles.inputContainerLabel }>Tap below to copy the signature</Text>
                                    <TouchableOpacity onPress={ () => this.copyOutput() }>
                                        <View style={{
                                            padding: 15,
                                            alignItems: 'center',
                                            backgroundColor: 'rgba(255, 255, 255, 0.05)',        
                                            borderRadius: 5
                                        }}>
                                            <Text style={{ color: 'white', fontFamily: 'source-code-pro' }}>{ this.state.outputHex }</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            }

                        </View>
                    </ScreenView>
                </KeyboardAvoidingView>                
            </View> 
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 5,
        padding: 20,
        marginBottom: 16.5,
    },
    inputContainerLabel: {
        color: '#cccccc',
        fontSize: 16,
        marginBottom: 16.5,
        flexDirection: 'row'
    },
    inputContainerLabelError: {
        color: '#ea3f52'
    },
    inputOptional: {
        color: '#888888'
    },
    inputFlexContainer: {
        flexDirection: 'row',
        marginLeft: -7.5,
        marginRight: -7.5,
        alignItems: 'center'
    },
    inputFlexSeparator: {
        color: '#bbbbbb',
        paddingLeft: 5,
        paddingRight: 5
    },
    label: {
        color: '#ffffff',
        fontSize: 16,
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
    picker: {
        color: 'white',
    }
});

export const screen = connect(state => ({
    app: state.app,
    utils: state.utils,
    wallets: state.wallets,
}))(SignerView);