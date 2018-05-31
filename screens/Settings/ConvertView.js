import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableWithoutFeedback, TouchableOpacity, Alert } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { Linking, WebBrowser } from 'expo';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';
import { lang } from 'moment';
import { capitalize } from '../../config/utils/unpackaged';

class ConvertView extends React.Component {

    state = {
        callback: () => {},
    }

    constructor(props) {
        super(props);

        this.state = this.props.navigation.state.params;
    }

    navigateBack() {
        this.props.navigation.navigate('ListView');
    }

    header() {
        const styles = {
            container: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                marginBottom: 20,
            },
            text: {
                fontWeight: '500',
                fontSize: 18,
            },
            icon: {
                fontSize: 28,
                marginRight: 15,
            },
        };

        return (
            <TouchableWithoutFeedback onPress={ this.navigateBack.bind(this) }>
                <View style={ styles.container }>
                    <Ionicons
                        name="md-arrow-back"
                        color="black"
                        style={ styles.icon }
                    />
                    <Text style={ styles.text }>Back to settings</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    oppositeMode() {
        return this.props.app.walletMode == 'hot' ? 'cold' : 'hot';
    }

    confirm() {
        const newMode = this.oppositeMode();
        Alert.alert(
            'Change Wallet Mode',
            `Are you absolutely sure you want to change your wallet mode to '${ newMode }'?`,
            [
                { text: 'No, cancel!', onPress: () => {} },
                { text: 'I\'m sure', onPress: () => this.state.callback(newMode) },
            ]
        );
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Settings' } />
                <View style={{ margin: 16.5, marginTop: 0, marginBottom: 0, flex: 1, borderRadius: 5, overflow: 'hidden' }}>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={ styles.container }>
                            { this.header() }
                            
                            <Text style={{ fontSize: 16, marginBottom: 16.5 }}>Your wallet is currently in '{ this.props.app.walletMode }' mode.</Text>
                            <Text style={{ fontSize: 16, marginBottom: 16.5 }}>To convert your wallet to { this.oppositeMode() } mode, click the button below.</Text>

                            <TouchableOpacity onPress={ () => this.confirm() }>
                                <View style={ styles.button }>
                                    <Text style={ styles.buttonText }>Convert to { capitalize(this.oppositeMode()) } Mode</Text>
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
    container: { 
        borderRadius: 5, 
        backgroundColor: '#ffffff', 
        overflow: 'hidden', 
        flex: 1, 
        padding: 30, 
    },
    header: {
        color: 'black',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 20,
    },
    icon: {
        fontSize: 28,
        paddingRight: 15,
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        paddingTop: 0,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingRight: 15, 
        marginBottom: 20,
    },
    itemText: {
        fontSize: 18,
        color: '#828282',
    },
    itemTextContainer: {
        display: 'flex',
        flexDirection: 'column',
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
}))(ConvertView);
