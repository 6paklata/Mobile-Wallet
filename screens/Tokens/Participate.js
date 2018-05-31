import React from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { LinearGradient, Linking, WebBrowser } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import Dropdown from 'app/components/Dropdown';
import TabView from './TabView';

import { Utils } from 'app/config';

const { scale } = Utils;

class ParticipateView extends React.Component {
    state = {
        filter: ''
    };

    openLink(url) {
        if(this.props.utils.walletMode == 'hot')
            return WebBrowser.openBrowserAsync(url);

        Linking.openURL(url);            
    }

    percentage(token) {
        return Math.floor((token.issued / token.supply) * 10000) / 100;
    }

    card({ item: token }) {
        return (
            <View key={ token.name } style={ styles.container }>
                <View style={[ styles.infoBox ]}>
                    <Text style={[ styles.label, { flex: 1, paddingRight: 15 } ]} numberOfLines={ 1 }>
                        { token.name }
                    </Text>
                    <Text style={ styles.labelGray }>
                        Ends { moment(token.ends).fromNow() }
                    </Text>
                </View>                
                <View style={ styles.progressBar }>
                    <View style={[ styles.grayBar, { width: (100 - this.percentage(token)) + '%' } ]} />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={[ styles.label, { color: '#50e3c2', fontFamily: 'source-code-pro', flex: 1 } ]}>
                        { this.percentage(token) }%
                    </Text>
                    <View style={ styles.infoBox }>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <Text style={[ styles.label, { color: '#50e3c2', fontFamily: 'source-code-pro' } ]} numberOfLines={ 1 }>
                                { (token.issued / 1000000).toLocaleString() }
                            </Text>
                            <Text style={[ styles.labelGray, { fontFamily: 'source-code-pro' } ]}> / </Text>
                            <Text style={[ styles.labelGray, { fontFamily: 'source-code-pro' } ]} numberOfLines={ 1 }> 
                                { (token.supply / 1000000).toLocaleString() }
                            </Text>
                        </View>
                    </View>                    
                </View>
            </View>
        );
    }

    render() {
        const { tokens } = this.props;

        const cards = Object.entries(tokens.tokenList).filter(([ tokenName, { begins, ends } ]) => {
            return tokenName.toLowerCase().includes(this.state.filter.toLowerCase())
                && begins < Date.now()
                && ends > Date.now();
        }).sort((a, b) => this.percentage(b[1]) - this.percentage(a[1])).map(([ tokenName, token ]) => {
            return {
                key: tokenName,
                ...token
            }
        });

        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Tokens' } />
                <TabView active={ 'Participate' } navigation={ this.props.navigation } />
                <TextInput 
                    style={ styles.textInput } 
                    placeholder={ 'Filter tokens...' } 
                    placeholderTextColor={ '#898989' } 
                    underlineColorAndroid={ 'transparent' } 
                    onChangeText={ filter => this.setState({ filter }) }
                    maxLength={ 32 }
                    returnKey={ 'next' }
                />     
                <ScreenView style={{ flex: 1 }}>
                    <View style={{ flex: 1, padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>                               
                        <FlatList data={ cards } renderItem={ token => this.card(token) } />
                    </View>
                </ScreenView>
            </View>        
        );
    }
}

const styles = StyleSheet.create({
    textInput: {
        height: 50,
        color: '#ffffff',
        fontSize: 16,
        borderWidth: 2,
        borderColor: '#2b3035',
        borderRadius: 5,
        marginBottom: 16.5,
        marginLeft: 16.5,
        marginRight: 16.5,
        paddingLeft: 15,
        paddingRight: 15
    },
    container: {
        padding: 15,
        flex: 1,
        flexDirection: 'column',
        width: '100%',
        borderRadius: 5,
        flex: 1,
        marginBottom: 16.5,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
    label: {
        fontSize: 17,
        color: 'white',
    },
    labelGray: {
        fontSize: 16,
        color: '#9b9b9b',
    },
    infoBox: {
        display: 'flex',
        flexDirection: 'row'
    },
    progressBar: {
        backgroundColor: '#50e3c2',
        height: 12,
        borderRadius: 12,
        position: 'relative',
        width: '100%',
        marginTop: 15,
        marginBottom: 15,
        padding: 2,
    },
    grayBar: {
        position: 'absolute',
        height: 8,
        top: 2,
        right: 2,
        backgroundColor: '#292f37',
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8
    },
});

export default connect(state => ({
    app: state.app,
    utils: state.utils,
    tokens: state.tokens
}))(ParticipateView);