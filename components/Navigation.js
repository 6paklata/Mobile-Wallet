import React from 'react';
import { Notifications } from 'expo';
import { createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import { screen as Wallets } from 'app/screens/Wallets';
import { screen as Tokens } from 'app/screens/Tokens';
import { screen as Vote } from 'app/screens/Vote';
import { screen as Signer } from 'app/screens/Signer';
import { screen as Contacts } from 'app/screens/Contacts';
import { screen as Settings } from 'app/screens/Settings';

export default createSwitchNavigator(
    {
        Wallets: { screen: Wallets },   
        Tokens: { screen: Tokens },     
        Vote: { screen: Vote },
        Signer: { screen: Signer },
        Contacts: { screen: Contacts },
        Settings: { screen: Settings },
    }, 
    { headerMode: 'none' }
);