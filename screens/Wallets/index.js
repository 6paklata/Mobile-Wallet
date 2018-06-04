import { createSwitchNavigator } from 'react-navigation';
import { Easing, Animated } from 'react-native';

import ListView from './ListView';
import DetailedView from './DetailedView';
import TransactionView from './TransactionView';
import FreezeView from './FreezeView';
import SendView from './SendView';
import ReceiveView from './ReceiveView';

import WalletNameView from 'app/screens/Wallets/CreateView/WalletName';
import WordListView from 'app/screens/Wallets/CreateView/WordList';

import ImportType from 'app/screens/Wallets/ImportView/ImportType';
import WordList from 'app/screens/Wallets/ImportView/WordList';
import PrivateKey from 'app/screens/Wallets/ImportView/PrivateKey';

export const screen = createSwitchNavigator({
    ListView: { screen: ListView },
    DetailedView: { screen: DetailedView },
    TransactionView: { screen: TransactionView },
    FreezeView: { screen: FreezeView },
    SendView: { screen: SendView },
    ReceiveView: { screen: ReceiveView },
    WalletNameView: { screen: WalletNameView },
    WordListView: { screen: WordListView },
    ImportType: { screen: ImportType },
    WordList: { screen: WordList },
    PrivateKey: { screen: PrivateKey },
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
});