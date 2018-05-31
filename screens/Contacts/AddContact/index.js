import React from 'react';
import { Image, Text, TextInput, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';
import { addContact } from 'app/reducers/contacts';

import Button from '../Button';

import { Utils } from 'app/config';

class AddContact extends React.Component {
    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.navigateBack() } />
    }

    navigateBack() {
        this.props.navigation.navigate('ListView');
    }

    state = {
        inputs: {
            name: '',
            address: '',
            logo: '',
        },
        errors: [],
    }

    constructor(props) {
        super(props);

        this.onInput = this.onInput.bind(this);
    }

    componentWillMount() {
        this.calculateErrors();
    }

    calculateErrors() {
        const errors = [];

        const {
            name,
            address
        } = this.state.inputs;

        if(!(/^([A-Za-z0-9]{1,32})$/.test(name)))
            errors.push('name');

        if(address.length != 35)
            errors.push('address');

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

    selectLogo(name) {
        this.setState({
            inputs: {
                ...this.state.inputs,
                logo: name
            },       
        });  
    }

    logos() {
        return Object.entries(this.props.contacts.logos).map(([name, image]) => {
            const selectedLogo = this.state.inputs.logo == name;
            const borderColor = selectedLogo ? 'white' : 'transparent';

            return (
                <View key={ name } style={{ width: '25%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                    <TouchableWithoutFeedback onPress={ () => this.selectLogo(name) }>
                        <View style={{ borderRadius: 5, borderColor, borderWidth: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 10, height: 50, width: 50 }}>
                            <Image
                                source={ image }
                                style={{ width: 30, height: 30 }} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        });
    }

    createContact() {
        if (this.state.errors.length > 0)
            return;

        const {
            name,
            address,
            logo
        } = this.state.inputs;

        this.props.addContact(name, {
            logo,
            addresses: [ address ],
        });
        
        this.props.navigation.navigate('ListView');
    }

    form() {
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
                        What would you like to name your contact? Alphanumeric, max 32 characters.
                    </Text>
                    <Button input={ 'Contact Name' } stateKey={ 'name' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('address') }>
                        What is the address of this contact? Alphanumeric, 35 characters.
                    </Text>
                    <Button input={ 'Contact Address' } stateKey={ 'address' } onInput={ this.onInput } />
                </View>

                <View style={ styles.inputContainer }>
                    <Text style={ getStyles('logo') }>
                        If you want, select a contact picture.
                    </Text>
                    <View style={ styles.logoGrid }>
                        { this.logos() }
                    </View>
                </View>

                <TouchableOpacity onPress={ () => this.createContact() }>
                    <View style={ styles.button }>
                        <Text style={ styles.buttonText }>Create Contact</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title='Contacts' leftButton={ this.headerButtons.left } />
                <ScreenView style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                        { this.form() }
                    </View>
                </ScreenView>
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
        color: '#d72b3f'
    },
    input: {
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',        
        borderRadius: 5,
        color: '#dddddd'
    },
    inputOptional: {
        color: '#888888'
    },
    inputFlex: {
        flex: 1,
        marginRight: 7.5,
        marginLeft: 7.5,
    },
    inputFlexContainer: {
        flexDirection: 'row',
        marginLeft: -7.5,
        marginRight: -7.5,
        alignItems: 'center'
    },
    logoGrid: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
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
    contacts: state.contacts,
}), dispatch => ({
    addContact: (contactID, contact) => {
        Utils.reducers.saveContact(contactID, contact);
    },
}))(AddContact);
