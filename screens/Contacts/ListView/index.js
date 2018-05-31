import React from 'react';
import { Image, Text, TextInput, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';

class ListView extends React.Component {
    state = {
        filter: '',
    }

    viewContact(contactID) {
        this.props.navigation.navigate('ViewContact', { contactID });
    }

    addContact() {
        this.props.navigation.navigate('AddContact');
    }

    logo(logo) {
        if (!logo) {
            return (
                <Ionicons
                    name='md-person'
                    color='#e4344d'
                    style={ styles.icon } />
            );
        }

        return (
            <Image
                source={ this.props.contacts.logos[logo] }
                style={ styles.image } resizeMode={ 'contain' } />
        );
    }

    addresses(addresses) {
        return addresses.slice(0, 1).map((address) => {
            return (
                <Text key={ address } style={{ color: '#b8b8b9' }} numberOfLines={ 1 }>{ address }</Text>
            );
        });
    }

    card(name, { logo, addresses }) {
        return (
            <TouchableWithoutFeedback onPress={ () => this.viewContact(name) }>
                <View style={ styles.container }>
                    <View style={ styles.logo }>
                        { this.logo(logo) }
                    </View>
                    <View style={ styles.details }>
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 3 }}>
                            { name }
                        </Text>
                        { this.addresses(addresses) }
                        { (addresses.length > 1) && <Text style={{ color: '#b8b8b9' }}>
                            ...and { addresses.length - 1 } more
                        </Text> }
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    cards() {
        const contacts = Object.entries(this.props.contacts.contacts).filter(([ name ]) => (
            name.toLowerCase().includes(this.state.filter.toLowerCase())
        ));

        return contacts.map(([ name, contact ]) => (
            <View key={ name } style={ styles.card }>{ this.card(name, contact) }</View>
        ));
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title='Contacts' />
                <TextInput 
                    style={ styles.textInput } 
                    placeholder={ 'Filter contacts...' } 
                    placeholderTextColor={ '#898989' } 
                    underlineColorAndroid={ 'transparent' } 
                    onChangeText={ (filter) => this.setState({ filter }) }
                    maxLength={ 32 }
                    returnKey={ 'next' }
                />
                <ScreenView style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                        { this.cards() }
                        <TouchableOpacity onPress={ () => this.addContact() } style={ styles.button }>
                            <Text style={ styles.buttonText }>Add New Contact</Text>
                        </TouchableOpacity>
                    </View>
                </ScreenView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        borderRadius: 5,
        marginBottom: 16.5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    container: {
        display: 'flex',
        flexDirection: 'row'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        paddingTop: 20,
        paddingRight: 20,
        paddingBottom: 20,
        justifyContent: 'center'
    },
    logo: {
        display: 'flex', 
        alignContent: 'center', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 30
    },
    icon: {
        fontSize: 28,
        width: 40,
        height: 40,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image: {
        width: 40,
        height: 40,
    },
    textInput: {
        height: 50,
        color: '#ffffff',
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#2b3035',
        borderRadius: 5,
        marginBottom: 16.5,
        marginLeft: 16.5,
        marginRight: 16.5,
        paddingLeft: 15,
        paddingRight: 15
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
}))(ListView);
