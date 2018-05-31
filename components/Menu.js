import React from 'react';

import { Dimensions, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo';

import Fade from 'app/components/Fade';

export default class Menu extends React.Component {
    state = {
        items: [],
    }

    componentWillMount() {
        const { items, style } = this.props;

        this.setState({
            items,
            style
        });
    }

    render() {
        const items = this.state.items.map(({ icon, title, onPress }, index) => {
            const Icon = icon.type;

            return (
                <TouchableWithoutFeedback key={ title } onPress={ onPress }>
                    <View style={ styles.menuItem }>
                        <Icon
                            name={ icon.name }
                            color={ '#828282' }
                            style= { styles.icons }
                        />
                        <Text style={ styles.menuText }>{ title }</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        });

        const { height, width } = Dimensions.get('window');

        const backdrop = {
            position: 'absolute',
            top: -200,
            right: -100,
            height: height + 200,
            width: width + 100,
            display: 'none'
        };

        if(this.props.open)
            backdrop.display = 'flex';

        return (
            <View style={[ styles.container, this.state.style ]} pointerEvents={ this.props.open ? 'auto' : 'none' }>
                <Fade visible={ this.props.open } style={ styles.menuContainer }>
                    <TouchableWithoutFeedback onPress={ this.props.hide }>
                        <BlurView tint={ 'dark' } intensity={ 70 } style={ backdrop } />
                    </TouchableWithoutFeedback>
                    <View style={ styles.menuBorder } />
                    <View style={ styles.menu }>
                        { items }
                    </View>
                </Fade>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    menuContainer: {
        position: 'absolute',
        right: 16.5,
        top: 0,
        zIndex: 20
    },
    menu: {
        backgroundColor: '#ffffff',
        borderRadius: 4,
        padding: 15,
        display: 'flex'
    },
    menuItem: {
        padding: 15,
        display: 'flex',
        flex: 1,
        flexDirection: 'row'
    },
    icons: {
        fontSize: 20,
        color: 'gray',
        paddingRight: 25,
    },
    menuText: {
        fontSize: 18,
        color: '#828282',
    },
    menuBorder: {
        position: 'absolute',
        top: -15,
        right: 14,
        width: 24,
        height: 19,
        borderTopWidth: 0,
        borderRightWidth: 24 / 2,
        borderBottomWidth: 19,
        borderLeftWidth: 24 / 2,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#ffffff',
        borderLeftColor: 'transparent'
    }
});