import React from 'react';

import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient, Haptic } from 'expo';

import DateRange from 'app/components/DateRange';
import moment from 'moment';

import { Utils } from 'app/config';

export default class DateFilter extends React.Component {
    state = {
        startDate: 0,
        endDate: 0,
        shouldShowCalendar: false,
        startString: 'Beginning of time',
        endString: 'End of time'
    }

    constructor(props) {
        super(props);

        this.triggerCalendar = this.triggerCalendar.bind(this);
    }

    componentWillMount() {
        const startDate = this.props.startDate || 0;
        const endDate = this.props.endDate || 0;

        this.setState({ startDate, endDate });
    }

    triggerCalendar() {
        Utils.feedback();
        this.setState({ shouldShowCalendar: !this.state.shouldShowCalendar });
    }

    handleChange({ startDate, endDate }) {
        let startString = moment(startDate).format('MMM D, YYYY');
        let endString = moment(endDate).format('MMM D, YYYY');

        if(endDate <= 86400) {
            endString = 'End of time';
            endDate = 0;
        }

        if(!startDate)
            startString = 'Beginning of time';

        this.setState({ 
            startString,
            endString,
            startDate,
            endDate,
            shouldShowCalendar: false
        });

        if(this.props.onChange)
            this.props.onChange({ startDate, endDate });
    }
   
    render() {
        let calendar = null;
        
        if(this.state.shouldShowCalendar)
            calendar = <DateRange onChange={ ({ startDate, endDate }) => this.handleChange({ startDate, endDate }) } />;

        return (
            <React.Fragment>
                <TouchableOpacity onPress={ this.triggerCalendar }>
                    <View style={ styles.filterContainer }>
                        <View>
                            <Text style={ styles.filterText }>{ this.state.startString }</Text>
                        </View>
                        <Text style={{ fontSize: 16, color: '#aaa', marginLeft: -5.5, marginRight: -5.5 }}>to</Text>
                        <View>
                            <Text style={ styles.filterText }>{ this.state.endString }</Text>
                        </View>
                        { /* <MaterialIcons
                            name={ 'date-range' }
                            style={{ position: 'absolute', right: 12.5, fontSize: 17.5, color: '#eee' }}
                        /> */ }
                    </View>
                </TouchableOpacity>
                { calendar }
            </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    filterContainer: {
        marginBottom: 16.5,
        borderRadius: 5,
        borderWidth: 3,
        borderColor: '#ffffff0d',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    filterText: {
        textAlign: 'center',
        color: '#ffffff',
        fontSize: 16,
        padding: 12.5
    },
});