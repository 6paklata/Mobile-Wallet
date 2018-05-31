import React from 'react';
import { connect } from 'react-redux';
import { View, ScrollView, PixelRatio, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo';

class ScreenView extends React.Component {
    static navigationOptions = {
        header: null
    };

    render() {
        const style = this.props.style || {};

        const calcMargin = () => {
            return {
                paddingBottom: this.props.footerHeight,
                flex: 1,
                width: '100%',
                ...style
            }
        }

        return (
            <ScrollView style={{ flex: 1 }} showsHorizontalScrollIndicator={ false }>
                <View style={ calcMargin() }>
                    { this.props.children }
                </View>
            </ScrollView>
        );
    }
}

export default connect(
    state => ({ ...state.utils })
)(ScreenView);