import React from 'react';
import { Image, Text, TextInput, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, Alert, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';
import { addContact } from 'app/reducers/contacts';

import { Utils } from 'app/config';

import Button from '../Button';

class ViewContact extends React.Component {

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.navigateBack() } />
    }

    navigateBack() {
        this.props.navigation.navigate('ListView');
    }
    
    state = {
        contact: {},
        contactID: '',
        input: {
            address: '',
        },
    }

    constructor(props) {
        super(props);

        const contactID = this.props.navigation.state.params.contactID;

        this.state.contact = this.props.contacts.contacts[contactID];
        this.state.contactID = contactID;

        this.onInput = this.onInput.bind(this);
    }

    navigateBack() {
        this.props.navigation.navigate('ViewContact', {
            contactID: this.state.contactID,
        });
    }

    saveAddress() {
        const newAddress = this.state.input.address;
        const isDuplicate = !this.state.contact.addresses.every((address) => address != newAddress);

        if (isDuplicate || newAddress.length != 35)
            return

        this.state.contact.addresses.push(this.state.input.address);

        this.props.addContact(this.state.contactID, this.state.contact);

        this.navigateBack();
    }

    onInput({ value }) {
        this.setState({
            input: {
                address: value,
            },  
        });
    }

    logo() {
        if (!this.state.contact.logo) {
            return (
                <Ionicons
                    name='md-person'
                    color='white'
                    style={ styles.icon } />
            );
        }

        return (
            <Image
                source={ this.props.contacts.logos[this.state.contact.logo] }
                style={ styles.image }/>
        );
    }

    render() {
        const getStyle = () => ([
            styles.inputContainerLabel, 
            this.state.input.address.length != 35 ? styles.inputContainerLabelError : {} 
        ]);

        return (
            <View style={{ flex: 1 }}>
                <Header title="Contacts" leftButton={ this.headerButtons.left } />
                <View style={{ margin: 16.5, marginTop: 0, marginBottom: 0, flex: 1, borderRadius: 15, overflow: 'hidden' }}>                    
                    <LinearGradient start={[ 1, 0 ]} end={[ 0, 0 ]} colors={ this.props.utils.theme.highlightGradient } style={{ 
                        position: 'absolute',
                        left: 0,
                        padding: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 125,
                        right: 0,
                        zIndex: 2
                    }}>   
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', padding: 15 }}>
                                { this.logo() }
                            </View>

                            <Text style={{ color: '#ffffff', fontSize: 22, marginTop: 1, fontFamily: 'source-code-pro' }}>
                                { this.state.contactID }
                            </Text>
                        </View>                  
                    </LinearGradient>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ 
                            backgroundColor: 'white',
                            borderRadius: 15, 
                            overflow: 'hidden', 
                            flex: 1, 
                            padding: 30, 
                            paddingTop: 735, /* This is so the background is white when a user pulls the view down */
                            marginTop: -600 
                        }}>
                            
                            <Text style={ getStyle() }>
                                What is the address you would like to add to this contact? Alphanumeric, 35 characters.
                            </Text>
                            <Button style={{ color: 'black', backgroundColor: 'rgba(0, 0, 0, 0.05)' }} input={ 'Contact Address' } stateKey={ 'address' } onInput={ this.onInput } />

                            <TouchableOpacity onPress={ () => this.saveAddress() }>
                                <View style={ styles.button }>
                                    <Text style={ styles.buttonText }>Save Address</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </ScreenView>
                </View>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    separator: {
        paddingBottom: 20, 
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        paddingTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        fontSize: 28,
        width: 30,
        height: 30,
        flex: 1,
    },
    image: {
        width: 30,
        height: 30,
    },
    button: {
        marginTop: 16.5,
        borderRadius: 5,
        padding: 20,
        backgroundColor: '#0b0f12',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center'
    },
    inputContainerLabel: {
        color: 'black',
        fontSize: 16,
        marginTop: 10,
        marginBottom: 16.5,
        flexDirection: 'row'
    },
    inputContainerLabelError: {
        color: '#d72b3f'
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
}))(ViewContact);
