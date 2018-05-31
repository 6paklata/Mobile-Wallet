import React from 'react';
import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableWithoutFeedback, Share } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons';
import { Linking, WebBrowser } from 'expo';

import ScreenView from 'app/components/ScreenView';
import { Header, HeaderButton } from 'app/components/Header';
import { lang } from 'moment';

class OptionsView extends React.Component {

    state = {
        options: {},
        activeKey: '',
        callback: () => {},
    }

    constructor(props) {
        super(props);

        this.state = this.props.navigation.state.params;
    }

    navigateBack() {
        this.props.navigation.navigate('ListView');
    }

    header() {
        const styles = {
            container: {
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
            },
            text: {
                fontWeight: '500',
                fontSize: 18,
            },
            icon: {
                fontSize: 28,
                marginRight: 15,
            },
        };

        return (
            <TouchableWithoutFeedback onPress={ this.navigateBack.bind(this) }>
                <View style={ styles.container }>
                    <Ionicons
                        name="md-arrow-back"
                        color="black"
                        style={ styles.icon }
                    />
                    <Text style={ styles.text }>Back to settings</Text>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    changeOption(key) {
        this.setState({
            activeKey: key,
        });

        this.state.callback(key);
    }

    options() {
        const styles = {
            item: {
                borderBottomColor: '#e5e5e5',
                borderBottomWidth: 1,
                paddingTop: 20,
                paddingBottom: 20,
                paddingLeft: 15,
                paddingRight: 15,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            text: {
                fontSize: 18,
            },
            icon: {
                fontSize: 22,
            },
        }

        return Object.entries(this.state.options).map(([ key, code ], index) => {
            const activeOption = this.state.activeKey == key;
            const color = activeOption ? 'black' : '#888888';
            
            return (
                <TouchableWithoutFeedback key={ key } onPress={ () => this.changeOption(key) }>
                    <View style={ styles.item }>
                        <Text style={ [ styles.text, { color } ] }>{ code }</Text>
                        { activeOption &&
                            <MaterialCommunityIcons
                                name='check'
                                color='#e1355e'
                                style={ styles.icon }
                            />
                        }
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Header title={ 'Settings' } />
                <View style={{ margin: 16.5, marginTop: 0, marginBottom: 0, flex: 1, borderRadius: 5, overflow: 'hidden' }}>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={ styles.container }>
                            { this.header() }
                            { this.options() }
                        </View>
                    </ScreenView>
                </View>                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
        borderRadius: 5, 
        backgroundColor: '#ffffff', 
        overflow: 'hidden', 
        flex: 1, 
        padding: 30, 
    },
    header: {
        color: 'black',
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 20,
    },
    icon: {
        fontSize: 28,
        paddingRight: 15,
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderBottomColor: '#e5e5e5',
        borderBottomWidth: 1,
        paddingTop: 0,
        paddingBottom: 20,
        paddingLeft: 15,
        paddingRight: 15, 
        marginBottom: 20,
    },
    itemText: {
        fontSize: 18,
        color: '#828282',
    },
    itemTextContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
});

export default connect(state => ({
    app: state.app,
    utils: state.utils,
}))(OptionsView);
