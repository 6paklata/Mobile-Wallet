import React from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { LinearGradient } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import Dropdown from 'app/components/Dropdown';
import TabView from './TabView';

import { Utils } from 'app/config';

const { scale } = Utils;

class OverviewView extends React.Component {
    state = {
        filter: ''
    };

    constructor(props) {
        super(props);
        Utils.reducers.refreshTokens();
    }
    
    display(token) {
        this.props.navigation.navigate('TokenView', { token });
    }

    card({ item: token }) {        
        return (
            <TouchableOpacity key={ token.name } onPress={ () => this.display(token) } style={ styles.container }>
                <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
                    { token.abbreviation && <Text style={[ styles.label, { paddingRight: 10, color: '#ccc',
                     fontWeight: 'bold' } ]}>
                        { token.abbreviation }
                    </Text> } 
                    <Text style={[ styles.label, { flex: 1 } ]} numberOfLines={ 1 }>
                        { token.name }
                    </Text>                    
                </View>
                <View style={ styles.infoBox }>
                    <Text style={ styles.labelGray }>Total Supply:</Text>
                    <Text style={ styles.labelRight } numberOfLines={ 1 }>{ token.supply.toLocaleString() }</Text>
                </View>
                <View style={ styles.infoBox }>
                    <Text style={ styles.labelGray }>Currently Issued:</Text>
                    <Text style={ styles.labelRight } numberOfLines={ 1 }>{ token.issued.toLocaleString() }</Text>
                </View>                    
                <View style={ styles.infoBox }>
                    <Text style={ styles.labelGray }>Registered:</Text>
                    <Text style={ styles.labelRight } numberOfLines={ 1 }>{ moment(token.registered).fromNow() }</Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        const { tokens } = this.props;

        const cards = Object.entries(tokens.tokenList).filter(([ tokenName ]) => {
            return tokenName.toLowerCase().includes(this.state.filter.toLowerCase())
        }).sort(([ tokenA ], [ tokenB ]) => tokenA - tokenB).map(([ tokenName, token ]) => {
            return {
                key: tokenName,
                ...token
            }
        });

        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Tokens' } />
                <TabView active={ 'Overview' } navigation={ this.props.navigation } />
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
    labelRight: {
        fontSize: 16,
        paddingLeft: 15,
        flex: 1,
        textAlign: 'right',
        color: '#ffffff'
    },
    infoBox: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 2
    },
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
});

export default connect(state => ({
    app: state.app,
    utils: state.utils,
    tokens: state.tokens
}))(OverviewView);