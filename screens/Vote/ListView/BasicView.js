import React from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo';

import { Utils } from 'app/config';

class BasicView extends React.Component {
    componentWillMount() {
        const { witnessID } = this.props;

        this.setState({
            witness: this.props.witnesses.witnessList[witnessID],
            witnessID
        });
    }

    render() {
        const { 
            witness, 
            witnessID 
        } = this.state;

        return (
            <View style={[ styles.container, { backgroundColor: this.props.utils.theme.cardBackground } ]}>
                <View style={[ styles.row, { marginBottom: 8 } ]}>
                    <Text style={ styles.repHeader } numberOfLines={ 1 }>
                        { witness.url }
                    </Text>
                    <LinearGradient start={[ 1, 0 ]} end={[ 0, 0 ]} colors={ this.props.utils.theme.highlightGradient } style={ styles.voteButton }>
                        <Text style={{ color: 'white' }}>Vote</Text>
                    </LinearGradient>
                </View>
                <View style={ styles.row }>
                    <Text style={ styles.leftTag }>
                        Votes 
                    </Text>
                    <Text style={ styles.rightTag } numberOfLines={ 1 }>
                        { witness.meta.votes.toLocaleString() }
                    </Text>
                </View>
                <View style={ styles.row }>
                    <Text style={ styles.leftTag }>
                        Blocks Produced 
                    </Text>
                    <Text style={ styles.rightTag } numberOfLines={ 1 }>
                        { witness.meta.blocksProduced.toLocaleString() }
                    </Text>
                </View>
                <View style={ styles.row }>
                    <Text style={ styles.leftTag }>
                        Blocks Missed 
                    </Text>
                    <Text style={ styles.rightTag } numberOfLines={ 1 }>
                        { witness.meta.blocksMissed.toLocaleString() }
                    </Text>
                </View> 
                <View style={ styles.row }>
                    <Text style={ styles.leftTag }>
                        Last Block 
                    </Text>
                    <Text style={ styles.rightTag } numberOfLines={ 1 }>
                        { witness.meta.lastBlock.toLocaleString() }
                    </Text>
                </View> 
            </View>          
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        flex: 1,
        marginBottom: 16.5,
        padding: 20,
    },
    row: { 
        display: 'flex', 
        flexDirection: 'row', 
        justifyContent: 'center',
        alignItems: 'center', 
        marginBottom: 2
    },
    leftTag: { 
        color: '#9b9b9b', 
        fontSize: 16 
    },
    rightTag: { 
        fontSize: 16,
        paddingLeft: 15,
        flex: 1,
        textAlign: 'right',
        color: '#ffffff'
    },
    repHeader: {
        fontSize: 17,
        color: '#ffffff',
        fontWeight: 'bold',
        flex: 1,
        paddingRight: 15
    },
    voteButton: {
        borderRadius: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        marginBottom: 5
    },
});

export default connect(state => ({ 
    witnesses: state.witnesses, 
    utils: state.utils 
}))(BasicView);