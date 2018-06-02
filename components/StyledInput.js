import React from 'react';

import moment from 'moment';
import DateTimePicker from 'react-native-modal-datetime-picker';

import { StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';

export default class StyledInput extends React.Component {
    state = {
        input: false,
        stateKey: false,
        type: 'default',
        multiline: false,
        flex: false,
        onInput: false,
        datetime: false,
        isPickerVisible: false
    }

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.setState({ ...this.props });
    }

    componentWillReceiveProps(nextProps) {
        if(this.state.input !== nextProps.input)
            this.setState({ input: nextProps.input });
    }

    onInput(value) {
        this.state.onInput({ 
            stateKey: this.state.stateKey, 
            value 
        });
    }

    renderDateTime() {
        const date = new Date(this.state.input);

        const onConfirm = date => {
            this.onInput(+date);
            this.setState({ isPickerVisible: false });
        }        

        return (
            <TouchableOpacity style={ styles.input } onPress={ () => this.setState({ isPickerVisible: true }) }>
                <Text style={ styles.inputText }>
                    { moment(this.state.input).format('ll LT') }
                </Text>
                <DateTimePicker
                    isVisible={ this.state.isPickerVisible }
                    onConfirm={ date => onConfirm(date) }
                    onCancel={ () => this.setState({ isPickerVisible: false }) }
                    mode={ 'datetime' }
                    date={ date }
                />
            </TouchableOpacity>
        );
    }

    render() {
        if(this.state.datetime)
            return this.renderDateTime();

        return (
            <TextInput
                style={[ styles.input, this.state.flex ? styles.inputFlex : {}, { color: '#dddddd' } ]}
                placeholder={ this.state.input }
                placeholderTextColor={ '#898989' } 
                underlineColorAndroid={ 'transparent' } 
                onChangeText={ value => this.onInput(value) }
                returnKey={ 'next' }
                keyboardType={ this.state.type }
                multiline={ this.state.multiline }
            />
        );
    }
}

const styles = StyleSheet.create({
    input: {
        padding: 15,
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',        
        borderRadius: 5
    },    
    inputFlex: {
        flex: 1,
        marginRight: 7.5,
        marginLeft: 7.5,
        textAlign: 'center'
    },
    inputText: {
        color: '#dddddd'
    }
});