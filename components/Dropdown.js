import React from 'react';

import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import { MaterialIcons } from '@expo/vector-icons';

export default class StyledDropdown extends React.Component {
    state = {
        options: [],
        value: false
    }

    onChange(value) {
        this.props.onChange(value);
    }

    componentWillMount() {
        this.setState({ 
            options: this.props.options,
            value: this.props.value
        });
    }

    componentWillReceiveProps(newProps) {
        this.setState({ 
            options: newProps.options,
            value: newProps.value
        });
    }

    render() {
        return (
            <View style={ styles.dropdownContainer }>
                <Dropdown 
                    value={ this.state.value }
                    data={ this.state.options }
                    onChangeText={ value => this.onChange(value) }
                    containerStyle={ styles.dropdown }
                    dropdownOffset={{ top: 15, left: 0 }}
                    baseColor={ 'transparent' }
                    textColor={ '#ffffff' }
                    selectedItemColor={ '#000000' }
                />
                <View style={ styles.dropdownArrowContainer } pointerEvents={ 'none' }>
                    <MaterialIcons 
                        name={ 'arrow-drop-down' }
                        style={ styles.dropdownArrow }
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dropdownContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 5,
        marginBottom: 0,
        paddingLeft: 15,
        paddingRight: 15
    },
    dropdown: {
        backgroundColor: 'transparent'
    },
    dropdownArrowContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        paddingRight: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdownArrow: {
        fontSize: 30,
        color: '#ffffff'
    },
});
