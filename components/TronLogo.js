import React from 'react';

import { Image } from 'react-native';

export default ({ size = 45, style = {} } = {}) => {
    return (
        <Image source={ require('app/assets/images/tron.png') } style={[ style, { width: size, height: size, resizeMode: 'contain' } ]} />
    );
}