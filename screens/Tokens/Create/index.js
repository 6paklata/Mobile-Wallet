import React from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import { LinearGradient, DangerZone } from 'expo';

import { Header, HeaderStyledInput } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import TabView from '../TabView';
import LocalError from 'app/components/LocalError';
import StyledInput from 'app/components/StyledInput';
import Fade from 'app/components/Fade';
import Dropdown from 'app/components/Dropdown';

import { Utils } from 'app/config';

const { scale } = Utils;
const { Lottie } = DangerZone;

const progressBar = require('app/assets/animations/passwordProgressBar.json');

class CreateView extends React.Component {
    state = {
        inputs: {
            name: '',
            accountID: false,
            abbreviation: '',
            supply: '',
            description: '',
            url: '',
            frozenSupply: 0,
            frozenDuration: 0,
            exchangeTRX: 1,
            exchangeToken: 10,
            startDate: Date.now() + 10 * 60 * 1000, // Start in 10 minutes
            endDate: Date.now() + 30 * 24 * 60 * 60 * 1000 // End in 30 days
        },
        eligibleAccounts: [],
        errors: [],
        showContent: true,
        loading: false
    };

    constructor(props) {
        super(props);
        
        this.onInput = this.onInput.bind(this);
    }

    componentWillMount() {
        const accounts = this.listEligibleAccounts();

        if(Object.keys(accounts).length) {
            this.setState({
                inputs: {
                    ...this.state.inputs,
                    accountID: Object.keys(accounts)[0]
                },
                eligibleAccounts: accounts
            });
        }

        setTimeout(() => {
            this.calculateErrors();
        }, 0);
    }

    componentWillReceiveProps() {
        const accounts = this.listEligibleAccounts();

        this.setState({
            eligibleAccounts: accounts
        });
    }

    listEligibleAccounts() {
        const { tokenList: tokens } = this.props.tokens;
        const owners = Object.values(tokens).map(({ address }) => address);

        return Object.entries(this.props.wallets.accounts).filter(([ accountID, { balances, publicKey } ]) => {
            return balances.Tron >= 1024 && !owners.includes(publicKey);  
        }).map(([ accountID, account ]) => account).sort((a, b) => {
            return b.balances.Tron - a.balances.Tron;  
        }).reduce((accounts, account) => {
            return accounts[account.accountID] = account, accounts;
        }, {})
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
        const inputs = this.state.inputs;
        const accountID = this.state.inputs.accountID;

        const token = {
            assetName: inputs.name,
            assetAbbr: inputs.abbreviation,
            totalSupply: inputs.supply,
            trxNum: inputs.exchangeTRX * 1000000,
            num: inputs.exchangeToken,
            startTime: inputs.startDate,
            endTime: inputs.endDate,
            url: inputs.url,
            description: inputs.description
        }

        if(inputs.frozenSupply) {
            token.frozen_supply = [{
                frozen_amount: inputs.frozenSupply,
                frozen_days: inputs.frozenDuration
            }];
        }

        const onConfirmation = async () => {
            this.toggleProgressBar();

            const result = await Utils.node.createToken(this.props.wallets.accounts[accountID], token);

            if(!result || !result.result) {
                return Alert.alert(
                    'Token Creation Failed',
                    'Sorry, we failed to create your token' + (result ? `: ${result.message}` : ''),
                    [
                        { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                    ],
                    { onDismiss: () => this.toggleProgressBar(true) }
                );
            }

            await Utils.reducers.refreshAccount(accountID, true);
            await Utils.reducers.refreshTokens();

            return Alert.alert(
                'Token Creation Success',
                'Your token was created successfully',
                [
                    { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                ],
                { onDismiss: () => this.toggleProgressBar(true) }
            )
        };

        Alert.alert(
            'Token Issue Confirmation',
            `Are you sure you want to create ${inputs.name}? It will cost ${Number(1024).toLocaleString()} TRX`,
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => onConfirmation() }
            ]
        );
    }

    calculateErrors() {
        const errors = [];

        const {
            name,
            accountID,
            abbreviation,
            supply,
            description,
            url,
            frozenSupply,
            frozenDuration,
            exchangeTRX,
            exchangeToken,
            startDate,
            endDate
        } = this.state.inputs;

        if(!(/^([A-Za-z0-9]{3,32})$/.test(name)))
            errors.push('name');

        if(!accountID)
            errors.push('accountID');

        if(!(/^([A-Za-z]{1,5})$/.test(abbreviation)))
            errors.push('abbreviation');

        if((Math.floor(supply) != supply) || supply < 1)
            errors.push('supply');

        if(description.trim().length > 200 || !description.trim().length)
            errors.push('description');

        if(url.trim().length > 256 || !url.trim().length)
            errors.push('url');

        if(frozenSupply && ((Math.floor(frozenSupply) != frozenSupply) || frozenSupply < 1))
            errors.push('frozen');

        if(frozenDuration && ((Math.floor(frozenDuration) != frozenDuration) || frozenDuration < 1))
            errors.push('frozen');

        if((Math.floor(exchangeTRX) != exchangeTRX) || exchangeTRX < 1)
            errors.push('exchange');
          
        if((Math.floor(exchangeToken) != exchangeToken) || exchangeToken < 1)
            errors.push('exchange');

        if(startDate < Date.now())
            errors.push('startDate');

        if(endDate <= Date.now() || endDate <= startDate)
            errors.push('endDate');

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

    onAccountChange(accountID) {
        this.setState({ 
            inputs: {
                ...this.state.inputs,
                accountID
            }
        });
    }

    form() {
        const exchangeValue = Math.floor(Math.max(1, this.state.inputs.exchangeToken / this.state.inputs.exchangeTRX) * 100) / 100;

        const getStyles = stateKey => {
            return [ 
                styles.inputContainerLabel, 
                this.state.errors.includes(stateKey) ? styles.inputContainerLabelError : {} 
            ];
        };

        const accounts = Object.values(this.state.eligibleAccounts).map(account => ({
            value: account.accountID,
            label: account.name
        }));

        return (
            <View style={ styles.container }>
                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('accountID') }>
                        Which wallet will own the token?
                    </Text>
                    <Dropdown 
                        value={ this.state.inputs.accountID }
                        options={ accounts }
                        onChange={ value => this.onAccountChange(value) }
                    />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('name') }>
                        What would you like to name your token? No spaces, alphanumeric, 3 to 32 characters.
                    </Text>
                    <StyledInput input={ 'Token Name' } stateKey={ 'name' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('abbreviation') }>
                        What will the token's abbreviation be? This can be between 1 and 5 letters
                    </Text>
                    <StyledInput input={ 'Token Abbreviation' } stateKey={ 'abbreviation' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('supply') }>
                        How many tokens will be in circulation?
                    </Text>
                    <StyledInput input={ 'Total Supply' } stateKey={ 'supply' } type={ 'numeric' } onInput={ this.onInput } />
                </View>
                
                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('description') }>
                        How would you describe your token? No longer than 200 characters.
                    </Text>
                    <StyledInput input={ 'Token Description' } stateKey={ 'description' } multiline onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('url') }>
                        What is the URL for the token?
                    </Text>
                    <StyledInput input={ 'Token URL' } stateKey={ 'url' } type={ 'url' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('frozen') }>
                        <Text style={ styles.inputOptional }>OPTIONAL   </Text>
                        <Text>How much of the supply will be frozen, and for how many days?</Text>
                    </Text>
                    <View style={ styles.inputFlexContainer }>
                        <StyledInput input={ 'Frozen Supply' } stateKey={ 'frozenSupply' } flex onInput={ this.onInput } />
                        <StyledInput input={ 'Days to Freeze' } stateKey={ 'frozenDuration' } flex onInput={ this.onInput } />
                    </View>                    
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('exchange') }>
                        What will be the exchange rate for your token? 
                        You will receive { exchangeValue } tokens for every 1 TRX
                    </Text>
                    <View style={ styles.inputFlexContainer }>
                        <StyledInput input={ '1 TRX' } stateKey={ 'exchangeTRX' } flex onInput={ this.onInput } />
                        <Text style={ styles.inputFlexSeparator }>to</Text>
                        <StyledInput input={ '10 Token' } stateKey={ 'exchangeToken' } flex onInput={ this.onInput } />
                    </View>                    
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('startDate') }>
                        When will the token sale begin?
                    </Text>
                    <StyledInput input={ this.state.inputs.startDate } datetime stateKey={ 'startDate' } onInput={ this.onInput } />                   
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('endDate') }>
                        When will the token sale end?
                    </Text>
                    <StyledInput input={ this.state.inputs.endDate } datetime stateKey={ 'endDate' } onInput={ this.onInput } />                   
                </View>

                <TouchableOpacity disabled={ !!this.state.errors.length } onPress={ () => this.submit() }>
                    <View style={ styles.button }>
                        <Text style={ styles.buttonText }>Create Token</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    errorView() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: this.props.utils.footerHeight }}>
                <Text style={{ width: '80%', maxWidth: '80%', flexWrap: 'wrap', color: '#ffffff', fontSize: 17, textAlign: 'center' }}>
                    You do not have any eligible wallets to vote with. 
                    Eligible accounts must hold a minimum of 1024 Tron to issue a token,
                    and can issue no more than one token
                </Text>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Tokens' } />
                <TabView active={ 'Create' } navigation={ this.props.navigation } />
                { this.state.inputs.accountID && <Fade visible={ this.state.showContent } style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={ styles.container } behavior={ 'padding' }>
                        <ScreenView style={{ flex: 1 }}>
                            <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                                { this.form() }
                            </View>
                        </ScreenView>
                    </KeyboardAvoidingView>
                </Fade> }
                <Fade visible={ this.state.loading } style={[ styles.loading, { marginBottom: this.props.utils.footerHeight } ]}>
                    <Lottie ref={ animation => {
                        this.progressBar = animation;
                    }} source={ progressBar } />
                </Fade>
                { !this.state.inputs.accountID && this.errorView() }
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
    },
});

export default connect(state => ({
    app: state.app,
    utils: state.utils,
    wallets: state.wallets,
    tokens: state.tokens
}))(CreateView);