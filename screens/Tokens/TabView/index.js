import React from 'react';

import { connect } from 'react-redux';
import { Text, StyleSheet, View, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo';

import CreateView from '../Create';
import OverviewView from '../Overview';
import ParticipateView from '../Participate';

import { Utils } from 'app/config';

const { scale } = Utils;

class TabView extends React.Component {
    state = {
        active: 'Overview',
        tabs: [ 'Overview', 'Participate', 'Create' ],
    };

    componentWillMount() {
        this.setState({ 
            active: this.props.active || 'Overview'
        });
    }

    colors(name) {
        if (this.state.active == name)
            return this.props.utils.theme.highlightGradient;

        return [ 'rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0)' ];
    }

    select(name) {
        this.props.navigation.navigate(`${name}View`);
    }

    tabs() {
        return this.state.tabs.map((name, index) => {
            return (
                <TouchableWithoutFeedback key={ index } onPress={ () => this.select(name) }>
                    <LinearGradient start={[ 1, 0 ]} end={[ 0, 0 ]} colors={ this.colors(name) } style={ styles.tab }>
                        <View>
                            <Text style={ styles.tabText }>{ name }</Text>
                        </View>
                    </LinearGradient>
                </TouchableWithoutFeedback>
            );
        });
    }

    render() {
        return (
            <View style={ styles.container }>
                { this.tabs() }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        borderColor: '#ed3f21',
        borderWidth: 2,
        borderRadius: 5,
        flexDirection: 'row',
        height: 45,
        margin: 16.5,
        marginTop: 10
    },
    tab: {
        flex: 1,
        height: 41,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        color: '#ffffff'
    }
});

export default connect(state => ({
    app: state.app,
    utils: state.utils,
}))(TabView);