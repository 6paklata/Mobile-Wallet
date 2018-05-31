import React from 'react';

import { connect } from 'react-redux';
import { createSwitchNavigator } from 'react-navigation';

import LocalError from 'app/components/LocalError';

import TokenView from './TokenView';
import CreateView from './Create';
import OverviewView from './Overview';
import ParticipateView from './Participate';

const renderer = props => {
    if(props.app.ready.tokens !== true) {
        return (
            <LocalError 
                title={ 'Failed to load tokens' } 
                error={ props.app.ready.tokens } 
            /> 
        );
    }

    const Navigator = createSwitchNavigator({
        TokenView: { screen: TokenView },
        CreateView: { screen: CreateView },
        OverviewView: { screen: OverviewView },
        ParticipateView: { screen: ParticipateView },
    }, {
        initialRouteName: 'OverviewView',
        headerMode: 'none',
        cardStyle: {
            backgroundColor: 'transparent'
        },
        transitionConfig() {
            return {
                containerStyle: {
                    backgroundColor: 'transparent'
                }
            }
        } 
    });

    return <Navigator />
};

export const screen = connect(state => state)(renderer);
