import React from 'react';

import { connect } from 'react-redux';
import { Platform, Text, StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, TextInput, KeyboardAvoidingView, Picker, Clipboard } from 'react-native';
import { LinearGradient, Linking, WebBrowser } from 'expo';

import DatePicker from 'react-native-datepicker'

import { Header, HeaderButton } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import LocalError from 'app/components/LocalError';
import Dropdown from 'app/components/Dropdown';

import moment from 'moment';

import Button from './Button';

import { Utils } from 'app/config';

const { scale } = Utils;

class SignerView extends React.Component {
    state = {
        contractType: 'Transfer',
        walletUUID: '',
        types: {
            Transfer: {
                name: 'Send TRX',
                inputs: {
                    recipient: {
                        text: 'Recipient',
                        label: 'What is the recipient address?',
                        type: 'default',
                    },
                    amount: {
                        text: 'Amount',
                        type: 'numeric',
                        label: 'How much TRX do you want to send?',
                    },
                },
            },
            TransferAsset: {
                name: 'Send Token',
                inputs: {
                    assetName: {
                        text: 'Asset Name',
                        label: 'Which token do you want to send?',
                        type: 'dropdown',
                        misc: {
                            options: {
                                tron: 'Tron',
                                other: 'Other',
                            },
                        },
                    },
                    recipient: {
                        text: 'Recipient',
                        label: 'What is the recipient address?',
                        type: 'default',
                    },
                    amount: {
                        text: 'Amount',
                        type: 'numeric',
                        label: 'How much of the token do you want to send?',
                    },
                },
            },
            AssetIssue: {
                name: 'Issue Asset',
                inputs: {
                    assetName: {
                        text: 'Asset Name',
                        label: 'What is the name of your token?',
                        type: 'default',
                    },
                    assetAbbr: {
                        text: 'Asset Abbreviation',
                        label: 'What is the abbreviation of your token?',
                        type: 'default',
                    },
                    totalSupply: {
                        text: 'Total Supply',
                        type: 'numeric',
                        label: 'What is the total supply?'
                    },
                    exchangeRate: {
                        label: 'What will be the exchange rate for your token?',
                        type: 'exchange',
                    },
                    startTime: {
                        type: 'date',
                        label: 'What is the start date of the contract?'
                    },
                    endTime: {
                        type: 'date',
                        label: 'What is the end date of the contract?',
                    },
                    description: {
                        text: 'Enter a description...',
                        label: 'What is the description of your token?',
                        type: 'default',
                    },
                    url: {
                        text: 'Enter a url...',
                        label: 'What should the URL for your contract be?',
                        type: 'default',
                    },
                },
            },
            FreezeBalance: {
                name: 'Freeze TRX',
                inputs: {
                    amount: {
                        text: 'Amount',
                        type: 'numeric',
                        label: 'How much TRX would you like to freeze?'
                    },
                    duration: {
                        text: 'Days to freeze for',
                        type: 'numeric',
                        label: 'How many days would you like to freeze it for?'
                    },
                },
            },
            UnfreezeBalance: {
                name: 'Unfreeze TRX',
                inputs: {},
            },
            ParticipateAssetIssue: {
                name: 'Token Participation',
                inputs: {
                    assetName: {
                        text: 'Asset Name',
                        type: 'default',
                        label: 'What is the name of the token?',
                    },
                    amount: {
                        text: 'Amount',
                        type: 'numeric',
                        label: 'How much would you like to buy?',
                    },
                },
            },
            VoteWitness: {
                name: 'Vote',
                inputs: {
                    address: {
                        text: 'Address',
                        type: 'default',
                        label: 'What is the address of the vote?',
                    },
                    count: {
                        text: 'Number of votes',
                        type: 'numeric',
                        label: 'How many votes would you like to cast?',
                    },
                },
            },
        },
        inputs: {
            
        },
        errors: [],
        outputHex: '',
    };

    constructor(props) {
        super(props);

        this.onInput = this.onInput.bind(this);
    }

    componentWillMount() {
        this.calculateErrors();
        
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
        return Object.entries(this.state.types).reduce((types, [ contractType, { name } ]) => ({ ...types, [contractType]: name }), {});
    }

    getWalletOptions() {
        return Object.entries(this.props.wallets.accounts).reduce((wallets, [ uuid, { name } ]) => ({ ...wallets, [uuid]: name }), {});
    }

    setDate(stateKey, date) {
        console.log(`Set date: ${ stateKey }, ${ date }`);
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
                        <Button input={ text } stateKey={ key } type={ type } onInput={ this.onInput } />
                    }

                    { type == 'dropdown' &&
                        <View>
                            <View style={ [ styles.pickerContainer, { marginBottom: 10 } ] }>
                                <Dropdown
                                    options={ misc.options }
                                    onSelectOption={ (value) => this.onInput({ stateKey: key, value }) } />
                            </View>

                            { (this.state.inputs[key] && this.state.inputs[key] != 'tron') &&
                                <Button input={ 'Token Name' } stateKey={ key } type={ type } onInput={ this.onInput } />
                            }
                        </View>
                    }

                    { type == 'exchange' &&
                        <View>
                            <Text style={ styles.inputContainerLabel }>
                                You will receive { exchangeValue } tokens for every 1 TRX
                            </Text>

                            <View style={ styles.inputFlexContainer }>
                                <Button input={ '1 TRX' } stateKey={ 'exchangeTRX' } flex onInput={ this.onInput } />
                                <Text style={ styles.inputFlexSeparator }>to</Text>
                                <Button input={ '10 Token' } stateKey={ 'exchangeToken' } flex onInput={ this.onInput } />
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
            contractType,
            inputs: {
                recentBlockBase64: this.state.inputs.recentBlockBase64,
            },
            outputHex: '',
        });

        console.log(`Selected: ${ contractType }`);
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
                                
                                <View style={ styles.pickerContainer }>
                                    <Dropdown
                                        options={ this.getContractTypes() }
                                        onSelectOption={ (contractType) => this.setContractType(contractType) } />
                                </View>
                            </View>

                            <View style={ styles.inputContainer }>
                                <Text style={ styles.inputContainerLabel }>
                                    Which wallet will the transaction occur from?
                                </Text>
                                
                                <View style={ styles.pickerContainer }>
                                    <Dropdown
                                        options={ this.getWalletOptions() }
                                        onSelectOption={ (walletUUID) => this.setState({ walletUUID }) } />
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
                                <Button input={ 'Recent Block' } stateKey={ 'recentBlockBase64' } onInput={ this.onInput } />
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
    pickerContainer: {
        padding: 5,
        borderColor: '#2d343a',
        borderWidth: 4,
        borderRadius: 5,
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