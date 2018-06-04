import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Haptic } from 'expo';
import { connect } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';

import ScreenView from 'app/components/ScreenView';
import LocalError from 'app/components/LocalError';

import { Header, HeaderButton } from 'app/components/Header';

import BasicView from './BasicView';

import { Utils } from 'app/config';

class ListView extends React.Component {
    constructor(props) {
        super(props);
        Utils.reducers.refreshWitnesses();
    }
    
    onPress(witnessID) {
        this.props.navigation.navigate('DetailedView', { witnessID });
        Utils.feedback();
    }

    render() {
        const witnesses = Object.keys(this.props.witnesses.witnessList).sort((a, b) => {
            return a.position - b.position;
        }).map((witnessID, index) => {
            return (
                <TouchableOpacity key={ witnessID } onPress={ () => this.onPress(witnessID) }>
                    <BasicView witnessID={ witnessID } />
                </TouchableOpacity>          
            );
        });

        return (
            <React.Fragment>
                { this.props.app.ready.representatives === true &&
                   <View style={{ flex: 1 }}>
                       <Header title={ 'Representatives' } />
                       <ScreenView style={{ flex: 1 }}>
                           <View style={{ padding: 16.5, paddingTop: 0, paddingBottom: 0 }}>
                               { witnesses }
                           </View>
                       </ScreenView>
                   </View>
                }
                { this.props.app.ready.representatives !== true && 
                    <LocalError 
                        title={ 'Failed to load representatives' } 
                        error={ this.props.app.ready.representatives } 
                    /> 
                }
            </React.Fragment>
        );
    }
}

export default connect(state => ({
    app: state.app,
    witnesses: state.witnesses
}))(ListView);