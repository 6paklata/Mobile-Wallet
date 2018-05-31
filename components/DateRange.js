import React from 'react';

import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import { Calendar, Arrow } from 'react-native-calendars';
import { MaterialIcons } from '@expo/vector-icons';
import { Utils } from 'app/config';

export default class DateRange extends React.Component {
    state = {
        startDate: false, 
        endDate: false, 
        dates: [],
        markedDates: { }
    }

    colours = {
        start: '#DC2C73',
        end: '#ED3F21',
        range: '#eee'
    }

    onPress({ dateString: date, day, month, timestamp, year }) {
        Utils.feedback();

        let startDate = this.state.startDate;
        let endDate = this.state.endDate;
        let dates = [];
        let markedDates = {};

        // This really needs cleaning up
        if(startDate && !endDate) {
            if(startDate > date) {
                endDate = startDate;
                startDate = date;
            } else endDate = date;
        } else if(startDate && endDate) {
            endDate = false;
            startDate = date;
        }

        if(endDate == startDate)
            endDate = false;

        if(!startDate)
            startDate = date;

        if(startDate && endDate) {
            let currentDate = new Date(startDate);

            while(currentDate <= new Date(endDate)) {
                const date = new Date(currentDate).toLocaleString('en-GB').split(',')[0].split('/').reverse().join('-');
                dates.push(date);
                currentDate.setDate(currentDate.getDate() + 1);
            }

            dates = dates.slice(1, -1);

            markedDates[startDate] = { startingDay: true, color: this.colours.start };

            dates.forEach(date => {
                markedDates[date] = { selected: true, color: this.colours.range, textColor: '#000' };
            });

            markedDates[endDate] = { endingDay: true, color: this.colours.end };
        }

        if(startDate && !endDate) 
            markedDates[startDate] = { startingDay: true, endingDay: true, color: this.colours.start };

        this.setState({ 
            startDate, 
            endDate, 
            dates,
            markedDates
        });
    }

    reset() {
        Utils.feedback();

        this.setState({
            startDate: false, 
            endDate: false, 
            dates: [],
            markedDates: { }
        });
    }

    save() {
        const { startDate, endDate } = this.state;

        const startTime = +new Date(startDate);
        const endTime = +new Date(endDate) + 60 * 60 * 24; // 24 days as max value

        if(this.props.onChange)
            this.props.onChange({ startDate: startTime, endDate: endTime });
    }

    // **Unix** timestamps
    render() {
        const style = {
            'stylesheet.calendar.header': {
                header: {
                    marginTop: 10,
                    marginBottom: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingLeft: 10,
                    paddingRight: 10,
                    alignItems: 'center'
                },
                monthText: {
                    fontSize: 17,
                    color: '#000000',
                    fontWeight: '500'
                },
                dayHeader: {
                    color: '#000000',
                    fontWeight: '600',
                    marginBottom: 15,
                    marginTop: 5
                }
            },
            'stylesheet.day.period': {
                text: {
                    marginTop: 0,
                    fontSize: 14,
                    fontWeight: '500'
                },
                todayText: {
                    fontWeight: '700',
                    marginTop: 0,
                    fontSize: 16
                },
                base: {
                    width: 38,
                    height: 38,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 0,
                    borderRadius: 19,
                    marginTop: 0,
                    marginBottom: 0
                },
                leftFiller: {
                    height: 38,
                    flex: 1
                },
                rightFiller: {
                    height: 38,
                    flex: 1
                },
                fillers: {
                    position: 'absolute',
                    height: 38,
                    flexDirection: 'row',
                    left: 0,
                    right: 0,
                    margin: 0
                }
            },
            'stylesheet.calendar.main': {
                week: {
                    marginTop: 2,
                    marginBottom: 2,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                },
                container: {
                    paddingLeft: 15,
                    paddingRight: 15,
                    backgroundColor: '#ffffff'
                }
            }
        };

        return (
            <React.Fragment>
                <Calendar 
                    { ...this.props }
                    style={ styles.container }
                    markingType={ 'period' }
                    markedDates={ this.state.markedDates }
                    onDayPress={ day => this.onPress(day) }
                    renderArrow={ direction => (<MaterialIcons
                        name={ 'keyboard-arrow-' + direction }
                        style={ styles.arrow }
                    />) }
                    theme={ style }
                />
                <View style={ styles.buttonContainer }>
                    <TouchableWithoutFeedback onPress={ () => this.reset() }>
                        <View style={ styles.flex }>
                            <Text style={ styles.transparentText }>Reset</Text>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={ () => this.save() }>
                        <View style={ styles.button }>
                            <Text style={ styles.buttonText }>Save</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </React.Fragment>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        marginBottom: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    arrow: {
        fontSize: 32,
        marginLeft: -21,
        marginRight: -21,
        color: '#000'
    },
    buttonContainer: {
        backgroundColor: '#ffffff',
        marginBottom: 16.5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        padding: 20,
        paddingTop: 19,
        flexDirection: 'row'
    },
    flex: {
        flex: 1,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#ffffff',        
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700'
    },
    transparentText: {
        color: '#000000',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        paddingRight: 20
    },
    button: {
        flex: 1,
        backgroundColor: '#0B0F12',
        padding: 20,
        borderRadius: 5,
    }
});