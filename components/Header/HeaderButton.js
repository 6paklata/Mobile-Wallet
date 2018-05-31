import React from 'react';
import PropTypes from 'prop-types';

import { MaterialIcons } from '@expo/vector-icons';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient, Haptic } from 'expo';
import { connect } from 'react-redux';
import { Utils } from 'app/config';

class HeaderButton extends React.Component {
    static propTypes = {
        icon: PropTypes.string.isRequired,
        showBorder: PropTypes.bool,
        onPress: PropTypes.func
    }

    state = {
        active: false
    }

    constructor() {
        super();
        this.onPress = this.onPress.bind(this);
    }

    onPress() {
        if(!this.props.onPress)
            return Utils.feedback('notification');

        this.props.onPress();
        Utils.feedback();
    }

    render() {
        let icon = (
            <MaterialIcons
                name={ this.props.icon }
                style={ styles.icon }
            />
        );

        if(this.props.showBorder) {
            const iconBackground = {
                width: '100%',
                height: '100%',
                borderRadius: 6,
                backgroundColor: '#0D1115',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            };

            icon = (
                <LinearGradient colors={ this.props.utils.theme.highlightGradient } style={ styles.iconBackgroundParent }>
                    <View style={ iconBackground }>
                        { icon }
                    </View>
                </LinearGradient>
            );
        }

        return (
            <TouchableWithoutFeedback onPressIn={ () => this.setState({ active: true }) } onPressOut={ () => this.setState({ active: false }) } onPress={ this.onPress }>
                <View style={ styles.button }>
                    { icon }
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        alignItems: 'center'
    },
    icon: {
        color: '#ffffff',
        fontSize: 25   
    },
    iconBackgroundParent: {
        width: '100%',
        height: '100%',        
        borderRadius: 6,
        padding: 2
    }
});

export default connect(state => ({ utils: state.utils }))(HeaderButton);