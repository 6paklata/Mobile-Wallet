import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Share } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { Linking, WebBrowser } from 'expo';

import { setWalletMode, setLanguage } from 'app/reducers/app';
import { setTheme } from 'app/reducers/utils';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';

import { themes, Utils } from 'app/config';
import { lang } from 'moment';

const { capitalize } = Utils;

class ListView extends React.Component {
    state = {
        settings: [
            {
                name: 'General',
                items: [
                    {
                        icon: {
                            type: MaterialCommunityIcons,
                            name: 'help-circle',
                        },
                        name: 'Help & Support',
                        action: this.openHelp.bind(this),
                    }, {
                        icon: {
                            type: MaterialCommunityIcons,
                            name: 'share-variant',
                        },
                        name: 'Share Tron Wallet',
                        action: this.share,
                    },
                ],
            }, 
            {
                name: 'Preferences',
                items: [
                    {
                        icon: {
                            type: Entypo,
                            name: 'warning',
                        },
                        name: 'Change Wallet Mode',
                        action: this.changeWalletMode.bind(this),
                    },
                    /*{
                        icon: {
                            type: MaterialIcons,
                            name: 'language',
                        },
                        name: 'Language',
                        action: this.changeLanguage.bind(this),
                    },
                    {
                        icon: {
                            type: MaterialCommunityIcons,
                            name: 'brush',
                        },
                        name: 'Theme',
                        action: this.changeTheme.bind(this),
                    },*/
                ],
            }
        ],
    };

    constructor(props) {
        super(props);

        this.state.languages = {
            en: 'English',
            fr: 'French',
            es: 'Español',
            it: 'Italiano',
            nl: 'Nederlands'
        };

        this.state.themes = Object.keys(themes).reduce((themes, theme) => {
            themes[theme] = capitalize(theme);
            return themes;
        }, {});
    }

    openHelp() {
        if(this.props.app.walletMode == 'hot')
            return WebBrowser.openBrowserAsync('http://google.com/');

        Linking.openURL('http://google.com/');            
    }

    share() {
        Share.share({
            message: 'Manage your Tron finances in the open source TronWatch app!', // desc from the site
            url: 'http://tron.watch/',
            title: 'Download TronWatch!',
        }, {
            dialogTitle: 'Share to:',
        });
    }

    changeWalletMode() {
        this.props.navigation.navigate('ConvertView', {
            callback: this.props.setWalletMode,
        });
    }

    changeLanguage() {
        this.props.navigation.navigate('OptionsView', {
            options: this.state.languages,
            activeKey: this.props.app.language,
            callback: this.props.setLanguage,
        });
    }

    changeTheme() {
        this.props.navigation.navigate('OptionsView', {
            options: this.state.themes,
            activeKey: this.props.utils.themeKey,
            callback: this.props.setTheme,
        });
    }

    list(items) {
        return items.map(({ icon, name, action }, index) => {
            const { type: IconType, name: iconName } = icon;

            return (
                <TouchableWithoutFeedback key={ name } onPress={ () => action() }>
                    <View style={ styles.item }>
                        <IconType
                            name={ iconName }
                            color="#828282"
                            style={ styles.icon }
                        />
                        
                        <View style={ styles.itemTextContainer }>
                            <Text style={ styles.itemText }>{ name }</Text>

                            { name == 'Language' &&
                                <Text>{ this.state.languages[this.props.app.language] }</Text>
                            }

                            { name == 'Theme' &&
                                <Text>{ capitalize(this.props.utils.themeKey) }</Text>
                            }

                            { name == 'Change Wallet Mode' &&
                                <Text>{ capitalize(this.props.app.walletMode) }</Text>
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    }

    groups() {
        return this.state.settings.map(({ name, items }) => {
            return (
                <View key={ name }>
                    <Text style={ styles.header }>{ name }</Text>
                    { this.list(items) }
                </View>
            );
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title="Settings" />
                <View style={{ margin: 16.5, marginTop: 0, marginBottom: 0, flex: 1, borderRadius: 5, overflow: 'hidden' }}>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={ styles.container }>
                            { this.groups() }
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
});

export default connect(state => ({
    app: state.app,
    utils: state.utils,
}), dispatch => ({
    setWalletMode: mode => {
        Utils.reducers.setWalletMode(mode);
    },
    setLanguage: language => {
        Utils.reducers.setLanguage(language);
    },
    setTheme: theme => {
        Utils.reducers.setTheme(theme);
    },
}))(ListView);
