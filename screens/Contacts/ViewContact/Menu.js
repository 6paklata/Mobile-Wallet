import React from 'react';
import { Dimensions, View, StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import Fade from 'app/components/Fade';

export default class Menu extends React.Component {
    items = [
        {
            icon: 'add-circle-outline',
            title: 'Add Address',
            onPress: () => this.props.addAddress(),
        }, 
        {
            icon: 'close',
            title: 'Remove Address',
            onPress: () => this.props.removeAddress(),
        },
        {
            icon: 'delete',
            title: 'Delete Contact',
            onPress: () => this.props.deleteContact(),
        }
    ];

    render() {
        items = this.items.map(({ icon, title, onPress }, index) => {
            return (
                <TouchableWithoutFeedback key={ title } onPress={ onPress }>
                    <View style={ styles.menuItem }>
                        <MaterialIcons
                            name={ icon }
                            color={ '#828282' }
                            style= { styles.icons }
                        />
                        <Text style={ styles.menuText }>{ title }</Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        });

        const { height } = Dimensions.get('window');

        const backdrop = {
            position: 'absolute',
            top: -100,
            left: 0,
            right: 0,
            height: height + 100,
            display: 'none'  
        };

        const container = {
            position: 'absolute',        
            top: 0,    
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
            display: 'none'
        };

        if(this.props.open) {
            container.display = 'flex';
            backdrop.display = 'flex';
        }

        return (
            <View style={ styles.container }>
                <TouchableWithoutFeedback onPress={ this.props.hide }>
                    <View style={ backdrop } />
                </TouchableWithoutFeedback>
                <Fade visible={ this.props.open } style={ styles.menuContainer }>
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
        padding: 10,
        display: 'flex',
        borderWidth: 2,
        borderColor: 'gray',
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