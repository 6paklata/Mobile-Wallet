import React from 'react';

import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import Dropdown from 'app/components/Dropdown';
import TabView from '../TabView';
import LocalError from 'app/components/LocalError';

import Button from './Button';

import { Utils } from 'app/config';

const { scale } = Utils;

class CreateView extends React.Component {
    state = {
        inputs: {
            name: '',
            abbreviation: '',
            supply: '',
            description: '',
            url: '',
            frozenSupply: 0,
            frozenDuration: 0,
            exchangeTRX: 1,
            exchangeToken: 10
        },
        errors: []
    };

    constructor(props) {
        super(props);
        
        this.onInput = this.onInput.bind(this);
    }

    componentWillMount() {
        this.calculateErrors();
    }

    submit() {
        // Token issue request created here.
    }

    calculateErrors() {
        const errors = [];

        const {
            name,
            abbreviation,
            supply,
            description,
            url,
            frozenSupply,
            frozenDuration,
            exchangeTRX,
            exchangeToken,
        } = this.state.inputs;

        if(!(/^([A-Za-z0-9]{3,32})$/.test(name)))
            errors.push('name');

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

    form() {
        const exchangeValue = Math.max(1, this.state.inputs.exchangeToken / this.state.inputs.exchangeTRX);

        const getStyles = stateKey => {
            return [ 
                styles.inputContainerLabel, 
                this.state.errors.includes(stateKey) ? styles.inputContainerLabelError : {} 
            ];
        }

        return (
            <View style={ styles.container }>
                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('name') }>
                        What would you like to name your token? No spaces, alphanumeric, 3 to 32 characters.
                    </Text>
                    <Button input={ 'Token Name' } stateKey={ 'name' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('abbreviation') }>
                        What will the token's abbreviation be? This can be between 1 and 5 letters
                    </Text>
                    <Button input={ 'Token Abbreviation' } stateKey={ 'abbreviation' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('supply') }>
                        How many tokens will be in circulation?
                    </Text>
                    <Button input={ 'Total Supply' } stateKey={ 'supply' } type={ 'numeric' } onInput={ this.onInput } />
                </View>
                
                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('description') }>
                        How would you describe your token? No longer than 200 characters.
                    </Text>
                    <Button input={ 'Token Description' } stateKey={ 'description' } multiline onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('url') }>
                        What is the URL for the token?
                    </Text>
                    <Button input={ 'Token URL' } stateKey={ 'url' } type={ 'url' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('frozen') }>
                        <Text style={ styles.inputOptional }>OPTIONAL   </Text>
                        <Text>How much of the supply will be frozen, and for how many days?</Text>
                    </Text>
                    <View style={ styles.inputFlexContainer }>
                        <Button input={ 'Frozen Supply' } stateKey={ 'frozenSupply' } flex onInput={ this.onInput } />
                        <Button input={ 'Days to Freeze' } stateKey={ 'frozenDuration' } flex onInput={ this.onInput } />
                    </View>                    
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('exchange') }>
                        What will be the exchange rate for your token? 
                        You will receive { exchangeValue } tokens for every 1 TRX
                    </Text>
                    <View style={ styles.inputFlexContainer }>
                        <Button input={ '1 TRX' } stateKey={ 'exchangeTRX' } flex onInput={ this.onInput } />
                        <Text style={ styles.inputFlexSeparator }>to</Text>
                        <Button input={ '10 Token' } stateKey={ 'exchangeToken' } flex onInput={ this.onInput } />
                    </View>                    
                </View>

                <TouchableOpacity onPress={ () => this.submit() }>
                    <View style={ styles.button }>
                        <Text style={ styles.buttonText }>Create Token</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Tokens' } />
                <TabView active={ 'Create' } navigation={ this.props.navigation } />
                <KeyboardAvoidingView style={ styles.container } behavior={ 'padding' }>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                            { this.form() }
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
});

export default connect(state => ({
    app: state.app,
    utils: state.utils,
}))(CreateView);