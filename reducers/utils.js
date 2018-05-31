export const BROADCAST_FOOTER_HEIGHT = 'UTILS_0';
export const STATUS_BAR_COLOR = 'UTILS_1';
export const SET_THEME = 'UTILS_2';

import { themes, Utils } from 'app/config';

export default (state = {
    footerHeight: 0,
    statusBarColor: 'transparent',
    statusHeight: Utils.statusBarHeight,
    themeKey: 'vibrant',
    theme: themes['vibrant']
}, action) => {
    switch(action.type) {
        case BROADCAST_FOOTER_HEIGHT:
            return { 
                ...state, 
                footerHeight: action.state.height
            };
        case STATUS_BAR_COLOR: {
            return {
                ...state,
                statusBarColor: action.state.color
            };
        }
        case SET_THEME: {
            return {
                ...state,
                themeKey: action.state.theme,
                theme: themes[theme]
            };
        }
        default:
            return state;
    }
}

export const broadcastFooterHeight = height => ({
    type: BROADCAST_FOOTER_HEIGHT,
    state: { height }
});

export const setStatusBarColor = color => ({
    type: STATUS_BAR_COLOR,
    state: { color }
});

export const setTheme = theme => ({
    type: CHANGE_THEME,
    state: { theme }
});