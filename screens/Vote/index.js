import { createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import ListView from './ListView';
import DetailedView from './DetailedView';

export const screen = createSwitchNavigator({
    ListView: { screen: ListView },
    DetailedView: { screen: DetailedView },
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
