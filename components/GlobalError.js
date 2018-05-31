import React from 'react';

import { View, Text, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

class GlobalError extends React.Component {
    render() {
        if(!this.props.globalError)
            return null;

        return (
            <View style={ styles.container }>
                <Text style={ styles.header }>{ this.props.globalError.title }</Text>
                <Text style={ styles.body }>{ this.props.globalError.error }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: '#FF3330', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    header: {
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 23
    },
    body: {
        color: '#ffffff',
        fontSize: 17,
        marginTop: 5
    }
});

export default connect(state => state.app)(GlobalError);