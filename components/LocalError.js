import React from 'react';

import { connect } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

class LocalError extends React.Component {
    render() {
        if(!this.props.title || !this.props.error)
            return null;

        return (
            <View style={[ styles.container, { paddingBottom: this.props.footerHeight } ]}>
                <Text style={ styles.header }>{ this.props.title }</Text>
                <Text style={ styles.body }>{ this.props.error }</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
    },
    header: {
        fontWeight: 'bold',
        color: '#ffffff',
        fontSize: 23
    },
    body: {
        color: '#ffffff',
        fontSize: 17,
        marginTop: 5,
        maxWidth: '75%',
        flexWrap: 'wrap',
        textAlign: 'center'
    }
});

export default connect(state => state.utils)(LocalError);