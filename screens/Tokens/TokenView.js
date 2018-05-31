import React from 'react';
import moment from 'moment';

import { View, Text, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient, Linking, WebBrowser } from 'expo';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';

class TokenView extends React.Component {
    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.navigateBack() } />,
        right: <HeaderButton icon='link' onPress={ () => this.openWebsite() } />
    }

    componentWillMount() {
        this.setState({
            ...this.props.navigation.state.params.token
        });
    }

    navigateBack() {
        this.props.navigation.navigate('OverviewView');
    }

    openWebsite() {
        if(this.props.app.walletMode == 'hot')
            return WebBrowser.openBrowserAsync(this.state.website);
        
        Linking.openURL(this.state.website); 
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={ this.state.name } leftButton={ this.headerButtons.left } rightButton={ this.headerButtons.right } />
                <View style={{ margin: 16.5, marginTop: 0, marginBottom: 0, flex: 1, borderRadius: 15, overflow: 'hidden' }}>                    
                    <LinearGradient start={[ 1, 0 ]} end={[ 0, 0 ]} colors={ this.props.utils.theme.highlightGradient } style={{ 
                        position: 'absolute',
                        left: 0,
                        padding: 30,
                        flexDirection: 'row',
                        alignItems: 'center',
                        height: 125,
                        right: 0,
                        zIndex: 2
                    }}>   
                        <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row' }}>
                            { this.state.abbreviation && <Text style={{ fontSize: 22, fontWeight: 'bold', paddingRight: 20, color: '#eee', fontFamily: 'source-code-pro' }}>
                                { this.state.abbreviation }
                            </Text> }
                            <Text style={{ color: '#ffffff', fontSize: 22, fontFamily: 'source-code-pro', flex: 1 }} numberOfLines={ 1 }>
                                { this.state.name }
                            </Text>
                        </View>                  
                    </LinearGradient>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ 
                            borderRadius: 15, 
                            backgroundColor: '#ffffff', 
                            overflow: 'hidden', 
                            flex: 1, 
                            padding: 30, 
                            paddingTop: 735, /* This is so the background is white when a user pulls the view down */
                            marginTop: -600 
                        }}>
                            <View style={ styles.separator }>
                                <Text style={ styles.headerText }>Website</Text>
                                <Text style={ styles.contentText } numberOfLines={ 1 }>{ this.state.website }</Text>
                            </View>
                            <View style={ styles.separator }>
                                <Text style={ styles.headerText }>Description</Text>
                                <Text style={[ styles.contentText, { flexWrap: 'wrap'} ]}>{ this.state.description }</Text>
                            </View>
                            <View style={ styles.separator }>
                                <Text style={ styles.headerText }>Total Supply</Text>
                                <Text style={ styles.contentText } numberOfLines={ 1 }>{ this.state.supply.toLocaleString() }</Text>
                            </View>
                            <View style={ styles.separator }>
                                <Text style={ styles.headerText }>Currently Issued</Text>
                                <Text style={ styles.contentText } numberOfLines={ 1 }>{ this.state.issued.toLocaleString() }</Text>
                            </View>
                            <View style={ styles.separator }>
                                <Text style={ styles.headerText }>Created</Text>
                                <Text style={ styles.contentText } numberOfLines={ 1 }>{ moment(this.state.registered).fromNow() }</Text>
                            </View>
                            <View style={ styles.separator }>
                                <Text style={ styles.headerText }>Sale { this.state.begins > Date.now() ? 'Begins' : 'Began' }</Text>
                                <Text style={ styles.contentText } numberOfLines={ 1 }>{ moment(this.state.begins).fromNow() }</Text>
                            </View>
                            <View style={{ paddingTop: 20 }}>
                                <Text style={ styles.headerText }>Sale { this.state.ends > Date.now() ? 'Finishes' : 'Finished' }</Text>
                                <Text style={ styles.contentText } numberOfLines={ 1 }>{ moment(this.state.ends).fromNow() }</Text>
                            </View>
                        </View>
                    </ScreenView>
                </View>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    separator: {
        paddingBottom: 20, 
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        paddingTop: 20
    },
    headerText: {
        color: '#0B0F12', 
        fontSize: 18, 
        marginBottom: 5, 
        fontWeight: '500'
    },
    contentText: {
        fontSize: 16,
        color: '#333333'
    }
});

export default connect(state => ({
    app: state.app,
    utils: state.utils
}))(TokenView);