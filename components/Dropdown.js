import React from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Text, Picker } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { Utils } from 'app/config';

const { scale } = Utils;

export default class Dropdown extends React.Component {

    state = {
        selectedValue: '',
    }

    constructor(props) {
        super(props);
    }

    selectOption(selectedValue) {
        this.setState({ selectedValue });
        this.props.onSelectOption(selectedValue);
    }

    render() {
        return (
            <Picker
                style={ styles.picker }
                selectedValue={ this.state.selectedValue }
                mode='dialog'
                onValueChange={ (value) => this.selectOption(value) }>

                {
                    Object.entries(this.props.options).map(([ key, value ]) => (
                        <Picker.Item key={ key } label={ value } value={ key } />
                    ))
                }
            </Picker>
        );
    }

    // style(first, last) {
    //     if (first) {
    //         return {
    //             borderTopLeftRadius: 5,
    //             borderTopRightRadius: 5,
    //             borderBottomLeftRadius: this.state.choosing ? 0 : 5,
    //             borderBottomRightRadius: this.state.choosing ? 0 : 5,
    //         };
    //     }

    //     if (last) {
    //         return {
    //             borderTopLeftRadius: 0,
    //             borderTopRightRadius: 0,
    //             borderBottomLeftRadius: 5,
    //             borderBottomRightRadius: 5,
    //         }
    //     }

    //     return {
    //         borderRadius: 0,
    //     };
    // }

    // toggle() {
    //     this.setState({
    //         choosing: !this.state.choosing,
    //     });
    // }

    // choose(option) {
    //     this.setState({
    //         choosing: false,
    //         selected: option,
    //     });

    //     if (this.props.onSelect)
    //         this.props.onSelect(option);
    // }

    // optionsView() {
    //     const options = this.props.options.map((option, index) => {
    //         const last = index == this.props.options.length - 1;

    //         return (
    //             <TouchableWithoutFeedback key={ option } onPress={ () => this.choose(option) }>
    //                 <View style={[ styles.dropdown, styles.dropdownOption, this.style(false, last) ]}>
    //                     <Text style={{ color: 'white', fontSize: 16 }}>{ option }</Text>
    //                 </View>
    //             </TouchableWithoutFeedback>
    //         );
    //     });

    //     return (
    //         <View style={{ position: 'absolute', left: 0, right: 0, top: 51 }}>
    //             { options }
    //         </View>
    //     );
    // }

    // render() {
    //     return (
    //         <View style={{ zIndex: 10 }}>
    //             <TouchableWithoutFeedback onPress={ () => this.toggle() }>
    //                 <View style={[ styles.dropdown, this.style(true, false) ]}>
    //                     <Text style={{ color: 'white', fontSize: 16 }}>
    //                         { this.state.selected || this.props.defaultValue }
    //                     </Text>
    //                     <MaterialIcons style={{ color: 'white', fontSize: scale(20) }} name="keyboard-arrow-down" />
    //                 </View>
    //             </TouchableWithoutFeedback>
    //             { this.state.choosing && this.optionsView() }
    //         </View>
    //     );
    // }
}

const styles = StyleSheet.create({
    dropdown: {
        width: '100%',
        padding: 15,
        borderColor: '#2d343a',
        borderWidth: 4,
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownOption: {
        backgroundColor: '#12181e',
    },
    pickerContainer: {
        padding: 5,
        borderColor: '#2d343a',
        borderWidth: 4,
        borderRadius: 5,
    },
    picker: {
        color: 'white',
    },
});
