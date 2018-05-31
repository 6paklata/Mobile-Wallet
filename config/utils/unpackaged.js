import { Dimensions } from 'react-native';
import { Platform, StatusBar } from 'react-native';
import { statusBarHeight } from 'app/components/SafeView';
import { Haptic } from 'expo';

const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

const statusBarOffset = Platform.OS == 'android' ? StatusBar.currentHeight : 0;
const statusBarHeightCached = statusBarHeight(false) + statusBarOffset;

export const feedback = (type = 'section') => {
    if(Platform.OS == 'android')
        return;

    switch(type) {
        case 'notification':
            Haptic.notification();
        default:
            Haptic.selection();
    }
}

export const scale = size => {
    return width / guidelineBaseWidth * size
};

export const timeout = duration => {
    return new Promise(resolve => {
        setTimeout(resolve, duration);
    });
}

export const capitalize = text => {
    return text.split('_').map(word => {
        return word[0].toUpperCase() + word.slice(1, word.length)
    }).join(' ');
}

export const trim = (text, length = 10) => {
    return text.length > length ? text.substr(0, length - 2) + '...' : text;
} 

export const toHexString = (byteArray) => (
    Array.from(byteArray, (byte) => (`0${(byte & 0xff).toString(16)}`).slice(-2)).join('')
);

export { 
    statusBarHeightCached as statusBarHeight, 
    statusBarOffset
};