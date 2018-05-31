import React from 'react';

import { createStackNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';
import { LinearGradient } from 'expo';
import { connect } from 'react-redux';

import Introduction from './parts/Introduction';
import WalletMode from './parts/WalletMode';
import WalletCreation from './parts/WalletCreation';
import PasswordSetup from './parts/PasswordSetup';
import WalletCreated from './parts/WalletCreated';

const fade = props => {
    const { position, scene } = props;
    const index = scene.index;

    const opacity = position.interpolate({
        inputRange: [ index - 0.7, index, index + 0.7 ],
        outputRange: [ 0.1, 1, 0.1 ]
    });

    return {
        opacity,
        transform: [ { translateX: 0 }, { translateY: 0 } ]
    };
};

export default connect(state => ({ utils: state.utils }))((props) => {
    const backgroundGradient = props.utils.theme.backgroundGradient;

    const Navigator = createStackNavigator({
        Introduction: { screen: Introduction },
        WalletMode: { screen: WalletMode },
        WalletCreation: { screen: WalletCreation },
        PasswordSetup: { screen: PasswordSetup },
        WalletCreated: { screen: WalletCreated }
    }, {
        initialRouteName: 'Introduction',
        cardStyle: {
            backgroundColor: 'transparent'
        },
        navigationOptions: { 
            headerStyle: {
                backgroundColor: 'transparent',
            },
            header: props => {
                return (
                    <LinearGradient colors={ backgroundGradient } style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0,
                        right: 0, 
                        bottom: 0, 
                        zIndex: -1 
                    }} />
                );
            }, 
        },
        transitionConfig: () => ({
            screenInterpolator: props => fade(props)
        })
    });

    return <Navigator screenProps={ props } />;
});