import { createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import ListView from './ListView';
import AddContact from './AddContact';
import ViewContact from './ViewContact';
import AddAddress from './AddAddress';

export const screen = createSwitchNavigator({
    ListView: { screen: ListView },
    AddContact: { screen: AddContact },
    ViewContact: { screen: ViewContact },
    AddAddress: { screen: AddAddress },
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
