import React from 'react';
import { connect } from 'react-redux';
import { View, StyleSheet, Text, TouchableWithoutFeedback, Opacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { LinearGradient, Haptic } from 'expo';

import { broadcastFooterHeight } from 'app/reducers/utils';
import { NavigationActions } from 'react-navigation';
import { isIPhoneX } from './SafeView';
import { Utils } from 'app/config';

class Footer extends React.Component {
    state = {
        activeScreen: 'Wallet',
        pressedScreen: false
    }

    screens = {    
        Wallets: {
            icon: 'wallet',
            iconType: Entypo,
            size: 29,
            modes: [ 'hot', 'cold' ]
        },    
        Tokens: {
            icon: 'checkbox-multiple-blank-circle-outline',
            iconType: MaterialCommunityIcons,
            size: 28,
            modes: [ 'hot' ]
        },
        Vote: {
            icon: 'checkbox-multiple-marked',
            iconType: MaterialCommunityIcons,
            size: 29,
            modes: [ 'hot' ]
        },
        Signer: {
            icon: 'lock',
            iconType: MaterialCommunityIcons,
            size: 28,
            modes: [ 'cold' ]
        },
        Contacts: {
            icon: 'md-contact',
            iconType: Ionicons,
            size: 29,
            modes: [ 'hot', 'cold' ]
        },
        Settings: {
            icon: 'cog',
            iconType: Entypo,
            size: 28,
            modes: [ 'hot', 'cold' ],
        }
    }

    constructor() {
        super();

        this.handlePressIn = this.handlePressIn.bind(this);
        this.handlePress = this.handlePress.bind(this);
        this.getTabBackground = this.getTabBackground.bind(this);
        this.getTabColour = this.getTabColour.bind(this);
        this.mounted = this.mounted.bind(this);
    }

    handlePressIn(screenName) {
        this.setState({ pressedScreen: screenName });
    }

    handlePress(screenName) {
        const { routes, index } = this.props.navigation.state;
        const currentRoute = routes[index];

        if(screenName == this.state.activeScreen)
            return;

        this.props.navigation.dispatch(NavigationActions.navigate({ routeName: screenName }));
        Utils.feedback();

        this.setState({ 
            pressedScreen: false, 
            activeScreen: screenName 
        });        
    }

    getTabBackground(screenName) {
        if(this.state.activeScreen == screenName)
            return this.props.utils.theme.highlightGradient;

        // Return two transparent colours as android requires two colours minimum
        return [ 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)' ];
    }

    getTabColour(screenName) {
        if(this.state.activeScreen == screenName)
            return '#ffffff';

        return '#eeeeee';
    }

    componentDidUpdate() {
        const { routes, index } = this.props.navigation.state;
        const currentRoute = routes[index];

        if(currentRoute.routeName !== this.state.activeScreen)
            this.setState({ activeScreen: currentRoute.routeName });
    }

    mounted({ nativeEvent }) {
        const { height } = nativeEvent.layout;
        this.props.broadcastFooterHeight(height);
    }

    render() {
        const filtered = Object.entries(this.screens).filter(([ screenName, { modes } ]) => {
            return modes.includes(this.props.app.walletMode);
        });

        const tabs = filtered.map(([ screenName, screen ]) => {
            const { icon: iconName, iconType: IconType, size, modes } = screen;

            const style = {};

            if(size) {
                style.height = size;
                style.width = size;
            }

            const icon = <IconType 
                name={ iconName } 
                color={ this.getTabColour(screenName) } 
                style={[ styles.footerElementIcon, style ]} 
            />;

            return (
                <TouchableWithoutFeedback key={ screenName } onPressIn={ () => this.handlePressIn(screenName) } onPress={ () => this.handlePress(screenName) }>
                    <View style={ styles.footerElement }>
                        <LinearGradient start={[ 1, 0 ]} end={[ 0, 0 ]} colors={ this.getTabBackground(screenName) } style={ styles.footerElementBackground }>
                            { icon }
                        </LinearGradient>
                        <Text style={ styles.footerElementText }>{ screenName }</Text>
                    </View>
                </TouchableWithoutFeedback>                            
            )
        });

        return (
            <LinearGradient colors={[ 'rgba(25, 32, 40, 0)', '#31353E' ]} style={ styles.footer }>
                <View style={ styles.footerContainer } onLayout={ this.mounted }>
                    { tabs } 
                </View>               
            </LinearGradient>     
        )
    }
};

const styles = StyleSheet.create({
    footer: {
        width: '100%',
        position: 'absolute',
        left: 0,
        bottom: 0,        
    },
    footerContainer: {
        display: 'flex',
        flexDirection: 'row',
        padding: 15,
        paddingBottom: isIPhoneX ? 20 : 15
    },
    footerElement: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerElementBackground: {
        padding: 8,
        marginBottom: 4,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerElementIcon: {
        fontSize: 30,
        lineHeight: 30,
        textAlign: 'center'
    },
    footerElementText: {
        fontSize: 13, 
        color: '#eeeeee'
    }
});

export default connect(
    state => ({
        app: state.app,
        utils: state.utils
    }),
    dispatch => ({
        broadcastFooterHeight: height => {
            dispatch(broadcastFooterHeight(height))
        } 
    })
)(Footer);