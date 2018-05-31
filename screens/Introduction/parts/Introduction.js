import React from 'react';

import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

import { Utils } from 'app/config';

import SafeView from 'app/components/SafeView';

class Introduction extends React.Component {
    advanceScreen() {
        this.props.navigation.navigate('WalletMode');
    }

    render() {
        return (
            <View style={{ flex: 1 }}>            
                <View style={ styles.background }>                    
                    <Image style={ styles.backgroundImage } source={ require('app/assets/images/introduction/intro-background.png')} resizeMode='contain' />
                </View>                
                <SafeView style={{ flex: 1 }} style={ styles.safeView }>
                    <Image source={ require('app/assets/images/introduction/intro-graphic.png') } style={ styles.image } resizeMode='contain' />
                    <Text style={ styles.header }>Welcome to your TronWatch mobile wallet</Text>
                    <Text style={ styles.content }>We're going to guide you through the creation of your first wallet. It should only take 30 seconds.</Text>
                    <TouchableOpacity style={ styles.button } onPress={ () => this.advanceScreen() }>
                        <Text style={ styles.buttonText }>Get Started</Text>
                    </TouchableOpacity>
                </SafeView>
                <View style={ styles.footer }>
                    <LinearGradient 
                        colors={ this.props.utils.theme.highlightGradient } 
                        start={[ 1, 0 ]} 
                        end={[ 0, 0 ]} 
                        style={[ styles.footerInactive, styles.footerActive ]}
                    />
                    <View style={ styles.footerInactive }></View>
                    <View style={ styles.footerInactive }></View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: 'center', 
        justifyContent: 'center'
    },
    backgroundGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        opacity: 0.4
    },
    safeView: {
        flex: 1, 
        paddingTop: Utils.statusBarOffset,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    footerInactive: {
        height: 11,
        width: 11,
        borderRadius: 11,
        backgroundColor: '#0B0F12',
        marginLeft: 10,
        marginRight: 10
    },
    footerActive: {
        width: 31,
        backgroundColor: '#ED3F21',
        marginLeft: 0,
        marginRight: 0
    },
    image: {
        maxWidth: '60%',
        aspectRatio: 1,
        display: 'none'
    },
    header: {
        color: '#ffffff',
        fontSize: 22,
        flexWrap: 'wrap',
        maxWidth: '80%',
        textAlign: 'center',
        fontWeight: '500',
        marginTop: 10
    },
    content: {
        color: '#ffffff',
        fontSize: 16,
        flexWrap: 'wrap',
        maxWidth: '80%',
        textAlign: 'center',
        marginTop: 15
    },
    button: {
        width: '80%',
        backgroundColor: '#0B0F12',
        borderRadius: 5,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold'
    }
});

export default connect(state => state)(Introduction);