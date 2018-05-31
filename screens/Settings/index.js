import { createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import ListView from './ListView';
import OptionsView from './OptionsView';
import ConvertView from './ConvertView';

export const screen = createSwitchNavigator({
    ListView: { screen: ListView },
    OptionsView: { screen: OptionsView },
    ConvertView: { screen: ConvertView },
}, {
    initialRouteName: 'ListView',
    headerMode: 'none',
    cardStyle: {
        backgroundColor: 'transparent'
    },
    transitionConfig() {
        return {
            containerStyle: {
                backgroundColor: 'transparent'
            }
       }
   } 
})
