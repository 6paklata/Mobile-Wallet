import { NavigationActions } from 'react-navigation';

let navigator;

export const setTopLevelNavigation = topLevelNavigator => {
    navigator = topLevelNavigator;
};

export const navigate = (routeName, params = {}) => {
    navigator(NavigationActions.navigate({ routeName, params }));
};