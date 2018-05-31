import React from 'react';
import { Image, Text, TextInput, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, FlatList, ScrollView, Alert, Clipboard } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';
import { addContact, deleteContact } from 'app/reducers/contacts';

import Menu from './Menu';

import { Utils } from 'app/config';
import { ACTION_NIGHT_DISPLAY_SETTINGS } from 'expo/src/IntentLauncherAndroid';


class ViewContact extends React.Component {

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.navigateBack() } />,
        right: <HeaderButton icon='more-horiz' onPress={ () => this.toggleMenu() } />
    }
    
    state = {
        isMenuOpen: false,
        contact: {},
        contactID: '',
        selectingAddresses: false,
        selectedAddresses: [],
    }

    constructor(props) {
        super(props);

        const contactID = this.props.navigation.state.params.contactID;

        this.state.contact = this.props.contacts.contacts[contactID];
        this.state.contactID = contactID;
    }

    navigateBack() {
        this.props.navigation.navigate('ListView');
    }

    toggleMenu() {
        if(this.state.isMenuOpen)
            Utils.feedback();

        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    addAddress() {
        this.props.navigation.navigate('AddAddress', {
            contactID: this.state.contactID,
        });
    }

    removeAddress() {
        this.setState({
            selectingAddresses: true,
        });
        this.toggleMenu();
    }

    deleteContact() {
        this.props.deleteContact(this.state.contactID);
        this.navigateBack();
    }

    select(address) {
        if (!this.state.selectingAddresses) {
            Alert.alert('Copy', `Do you want to copy '${address}' to your clipboard?`, [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sure', onPress: () => Clipboard.setString(address) },
            ]);
            return;
        }

        if (this.state.selectedAddresses.includes(address)) {
            // remove the selected address
            this.setState({
                selectedAddresses: this.state.selectedAddresses.filter(e => e != address),
            })
        } else {
            // add the selected address
            this.setState({
                selectedAddresses: [
                    ...this.state.selectedAddresses,
                    address,
                ],
            });
        }
        
    }

    deleteAddresses() {
        if (this.state.selectedAddresses.length == 0 || !this.state.selectingAddresses)
            return;

        const filtered = this.state.contact.addresses.filter((address) => !this.state.selectedAddresses.includes(address));

        const contact = {
            logo: this.state.contact.logo,
            addresses: filtered,
        };

        if (filtered.length == 0) {
            this.props.deleteContact(this.state.contactID);
            this.navigateBack();
        } else {
            this.props.addContact(this.state.contactID, contact);
        }

        this.setState({
            selectingAddresses: false,
            selectedAddresses: [],
            contact,
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

    addresses() {
        return this.state.contact.addresses.map((address) => {
            const selected = this.state.selectedAddresses.includes(address);
            const icon = selected ? 'check-box' : 'check-box-outline-blank';

            return (
                <View style={ styles.separator } key={ address }>
                    <TouchableWithoutFeedback onPress={ () => this.select(address) }>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            { this.state.selectingAddresses &&
                                <MaterialIcons
                                name={ icon }
                                color='black'
                                style={{ padding: 5, fontSize: 22 }}/>
                            }
                            <Text style={{ fontSize: 16, fontFamily: 'source-code-pro' }}>{ address }</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            );
        });
    }

    render() {
        const buttonText = () => {
            const length = this.state.selectedAddresses.length;

            if (length == 0)
                return 'Select an Address'
            
            return `Delete ${ length } address${ length > 1 ? 'es' : '' }`
        };

        const buttonStyle = () => {
            const length = this.state.selectedAddresses.length;
            return {
                backgroundColor: length == 0 ? '#0b0f1287' : '#0b0f12d1',
            };
        }

        return (
            <View style={{ flex: 1, marginBottom: 50 }}>
                <Header title="Contacts" leftButton={ this.headerButtons.left } rightButton={ this.headerButtons.right } />   
                <Menu
                    open={ this.state.isMenuOpen }
                    hide={ () => this.toggleMenu() }
                    addAddress={ this.addAddress.bind(this) }
                    removeAddress={ this.removeAddress.bind(this) }
                    deleteContact={ this.deleteContact.bind(this) }
                    style={{ zIndex: 20 }}
                />                                           
                <View style={{ margin: 16.5, marginTop: 0, marginBottom: 0, flex: 1, borderRadius: 15, overflow: 'hidden' }}>                 
                    <LinearGradient start={[ 1, 0 ]} end={[ 0, 0 ]} colors={ this.props.utils.theme.highlightGradient } style={{ 
                        position: 'absolute',
                        left: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 125,
                        right: 0,
                        zIndex: 2
                    }}>   
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', alignItems: 'center', padding: 30 }}>
                                { this.logo() }
                            </View>
                            <Text style={{ color: '#ffffff', fontSize: 22, marginTop: 1, fontFamily: 'source-code-pro' }}>
                                { this.state.contactID }
                            </Text>
                        </View>                  
                    </LinearGradient>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ 
                            borderRadius: 15, 
                            backgroundColor: '#ffffff', 
                            overflow: 'hidden', 
                            flex: 1, 
                            padding: 30, 
                            paddingTop: 735, /* This is so the background is white when a user pulls the view down */
                            marginTop: -600 
                        }}>
                            { this.addresses() }
                        </View>
                    </ScreenView>
                </View>                 
                { this.state.selectingAddresses &&
                    <View style={{ paddingBottom: 50, paddingTop: 16.5, marginLeft: 16.5, marginRight: 16.5 }}>
                        <TouchableOpacity onPress={ () => this.deleteAddresses() } style={ [ styles.button, buttonStyle() ] }>
                            <Text style={ styles.buttonText }>
                                { buttonText() }
                            </Text>
                        </TouchableOpacity>
                    </View>
                }      
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
        borderRadius: 5,
        padding: 15,
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
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
    deleteContact: contactID => {
        Utils.reducers.deleteContact(contactID);
    }
}))(ViewContact);
