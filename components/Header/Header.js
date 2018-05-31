import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { StyleSheet, View, Image, Text } from 'react-native';

import HeaderButton from './HeaderButton';
import TronLogo from '../TronLogo';

class Header extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        leftButton: PropTypes.object,
        rightButton: PropTypes.object
    }

    render() {
        return (
            <View style={ styles.header }>
                <View style={ styles.headerButton }>
                    { this.props.leftButton }  
                </View>
                <View style={ styles.headerMiddle }>
                    <TronLogo size={ 45 } style={ styles.headerIcon } />
                    <View style={ styles.headerTitle }>
                        <Text style={ styles.headerTitleText }>
                            { this.props.title.toUpperCase() }
                        </Text>
                    </View>
                </View>
                <View style={ styles.headerButton }>
                    { this.props.rightButton }  
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        display: 'flex',
        flexDirection: 'row',
        padding: 23,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15
    },
    headerButton: {
        height: 40,
        width: 40
    },
    headerMiddle: {
        height: 40,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        marginTop: 0,
        display: 'flex',
        flexDirection: 'row'
    },
    headerTitleText: {
        color: '#ffffff',
        fontSize: 19,
        lineHeight: 19
    },
    headerIcon: {
        position: 'absolute',
        opacity: 0.1
    }
});

export default connect(state => ({ 
    utils: state.utils 
}))(Header);