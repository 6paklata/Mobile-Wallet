import React from 'react';

import { LinearGradient } from 'expo';
import { connect } from 'react-redux';
import { Image, Text, View, StyleSheet } from 'react-native';

import TronLogo from './TronLogo';

class LoadingScreen extends React.Component {
    render() {
        return (
            <LinearGradient colors={ this.props.utils.theme.highlightGradient } style={ styles.background }>
                <TronLogo size={ 200 } style={ styles.logo } />
                <Text style={ styles.logoText }>TRONWATCH</Text>
            </LinearGradient>
        );
    }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
    },
    logo: {
        alignItems: 'center',
        maxWidth: '50%'
    },
    logoText: {
        fontSize: 40,
        marginTop: 20,
        fontWeight: 'bold',
        color: '#FFFFFF'
    }
});

export default connect(state => ({ utils: state.utils }))(LoadingScreen);