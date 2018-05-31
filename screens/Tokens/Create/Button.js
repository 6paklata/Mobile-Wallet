import React from 'react';

import { StyleSheet, TextInput } from 'react-native';

export default ({ input, stateKey, type = 'default', multiline = false, flex = false, onInput }) => (
    <TextInput
        style={[ styles.input, flex ? styles.inputFlex : {} ]}
        placeholder={ input }
        placeholderTextColor={ '#898989' } 
        underlineColorAndroid={ 'transparent' } 
        onChangeText={ value => onInput({ stateKey, value }) }
        returnKey={ 'next' }
        keyboardType={ type }
        multiline={ multiline }
    />
);

const styles = StyleSheet.create({
    input: {
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',        
        borderRadius: 5,
        color: '#dddddd'
    },    
    inputFlex: {
        flex: 1,
        marginRight: 7.5,
        marginLeft: 7.5,
        textAlign: 'center'
    },
})