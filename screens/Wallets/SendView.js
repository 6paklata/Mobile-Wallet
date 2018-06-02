import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient, Linking, WebBrowser, DangerZone } from 'expo';

import Fade from 'app/components/Fade';
import ScreenView from 'app/components/ScreenView';
import StyledInput from 'app/components/StyledInput';
import Dropdown from 'app/components/Dropdown';

import { Utils } from 'app/config';
import { Header, HeaderButton } from 'app/components/Header';

const { Scale } = Utils;
const { Lottie } = DangerZone;

const progressBar = require('app/assets/animations/passwordProgressBar.json');

class SendView extends React.Component {
    state = {
        showContent: true,
        loading: false,
        account: false,
        accountID: false,
        errors: [],
        inputs: {
            address: false,
            customAddress: false,
            token: 'Tron',
            amount: 0           
        }
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.navigateBack() } showBorder />
    }

    constructor(props) {
        super(props);

        this.onInput = this.onInput.bind(this);
    }

    navigateBack() {
        this.props.navigation.navigate('DetailedView', { walletID: this.state.accountID });
    }

    componentWillMount() {
        this.props = {
            ...this.props,
            ...this.props.navigation.state.params
        }

        const { accountID } = this.props;
        const account = this.props.wallets[accountID];

        this.setState({
            accountID,
            account
        });
    }

    componentDidMount() {
        this.calculateErrors();
    }

    calculateErrors() {
        const errors = [];

        const {
            address,
            customAddress,
            token,
            amount
        } = this.state.inputs;

        if(address && !(/^([A-Za-z0-9]{34,36})$/.test(address)))
            errors.push('address');

        if(!address && !(/^([A-Za-z0-9]{34,36})$/.test(customAddress)))
            errors.push('customAddress');

        if(token == 'Tron' && (!(amount > 0) || isNaN(amount)))
            errors.push('amount');
        
        if(token !== 'Tron' && ((Math.floor(amount) != amount) || amount < 1))
            errors.push('amount')
        
        if(amount > this.state.account.balances[token])
            errors.push('amount');

        this.setState({ errors });
    }

    onInput({ stateKey, value }) {
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

    onDropdownChange(address) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                address
            }
        });
    }

    async toggleProgressBar(showContent = false) {
        if(showContent) {
            this.setState({ loading: false });

            await Utils.timeout(300);
            return this.setState({ showContent: true });
        }

        this.setState({ showContent: false });
        await Utils.timeout(300);

        this.setState({ loading: true });
        this.progressBar.play();
    }

    submit() {
        const { account } = this.state;

        const { 
            amount,
            token
        } = this.state.inputs;

        const address = this.state.inputs.address || this.state.inputs.customAddress;

        const onConfirmation = async () => {
            this.toggleProgressBar();

            const result = await Utils.node.send(account, {
                address,
                token,
                amount
            });

            if(!result || !result.result) {
                return Alert.alert(
                    'Transaction Failed',
                    'Sorry, we failed to send your transaction' + (result ? `: ${result.message}` : ''),
                    [
                        { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                    ],
                    { onDismiss: () => this.toggleProgressBar(true) }
                );
            }

            await Utils.reducers.refreshAccount(account.accountID, true);

            return Alert.alert(
                'Transaction Success',
                'Your transaction was sent successfully',
                [
                    { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                ],
                { onDismiss: () => this.toggleProgressBar(true) }
            )
        };

        Alert.alert(
            'Send Confirmation',
            `Are you sure you want to send ${amount.toLocaleString()} ${Utils.trim(token)} to ${address}?`,
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => onConfirmation() }
            ]
        );
    }

    form() {
        const getStyles = stateKey => {
            return [ 
                styles.inputContainerLabel, 
                this.state.errors.includes(stateKey) ? styles.inputContainerLabelError : {} 
            ];
        }

        const addresses = [
            { value: false, label: 'Custom Address' },
        ];

        const tokens = [];

        const { 
            TronPower, 
            ...eligibleTokens 
        } = this.state.account.balances;

        Object.keys(this.props.contacts).forEach(contactName => {
            this.props.contacts[contactName].addresses.forEach(address => {
                addresses.push({ value: address, label: `${contactName}: ${address}` })
            });
        });        

        Object.entries(eligibleTokens).sort((a, b) => b[1] - a[1]).forEach(([ tokenName, tokenAmount ]) => {
            tokens.push({ value: tokenName, label: `${tokenName}: ${tokenAmount}` });
        });

        return (
            <View style={ styles.container }>
                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('address') }>
                        Who would you like to send the transaction to?
                    </Text>
                    <View style={ styles.dropdownContainer }>
                        <Dropdown 
                            value={ this.state.inputs.address }
                            options={ addresses }
                            onChange={ value => this.setState({ inputs: { ...this.state.inputs, address: value } }) }
                        />
                    </View>
                </View>

                { !this.state.inputs.address && <View style={ styles.inputContainer }>
                    <Text style={ getStyles('customAddress') }>
                        What is the address of the recipient?
                    </Text>
                    <StyledInput input={ 'Recipient Address' } stateKey={ 'customAddress' } onInput={ this.onInput } />
                </View> }

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('token') }>
                        What token would you like to send?
                    </Text>
                    <View style={ styles.dropdownContainer }>
                        <Dropdown 
                            value={ this.state.inputs.token }
                            options={ tokens }
                            onChange={ value => this.setState({ inputs: { ...this.state.inputs, token: value } }) }
                        />
                    </View>
                </View>

                 <View style={ styles.inputContainer }>
                    <Text style={ getStyles('amount') }>
                        How many tokens do you want to send?
                    </Text>
                    <StyledInput input={ 'Total Amount' } stateKey={ 'amount' } onInput={ this.onInput } />
                </View>

                <TouchableOpacity onPress={ () => this.submit() } disabled={ !!this.state.errors.length }>
                    <View style={ styles.button }>
                        <Text style={ styles.buttonText }>Send Transaction</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {      
        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Send Funds' } leftButton={ this.headerButtons.left } />
                <Fade visible={ this.state.showContent } style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={ styles.container } behavior={ 'padding' }>
                        <ScreenView style={{ flex: 1 }}>
                            <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                                { this.form() }
                            </View>
                        </ScreenView>
                    </KeyboardAvoidingView>
                </Fade> 
                <Fade visible={ this.state.loading } style={[ styles.loading, { marginBottom: this.props.utils.footerHeight } ]}>
                    <Lottie ref={ animation => {
                        this.progressBar = animation;
                    }} source={ progressBar } />
                </Fade>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
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
    }
});

export default connect(state => ({ 
    wallets: state.wallets.accounts,
    contacts: state.contacts.contacts,
    contactLogos: state.contacts.logos,
    utils: state.utils,
    app: state.app
}))(SendView);