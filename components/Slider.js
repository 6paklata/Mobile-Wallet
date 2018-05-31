import React from 'react';
import Slider from 'react-native-slider';

import { StyleSheet, View, TouchableWithoutFeedback, Text } from 'react-native';
import { connect } from 'react-redux';
import { LinearGradient } from 'expo';

class SliderComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            min: this.props.min,
            max: this.props.max,
            step: this.props.step || 1,
        };
    }

    valueChange(value) {
        this.setState({
            progress: value / this.state.max,
        });

        if (this.props.onValueChange)
            this.props.onValueChange(value);
    }

    render() {
        return (
            <View style={{ position: 'relative', borderRadius: 20 }}>
                <View style={[ styles.customTrack, { backgroundColor: '#000000' } ]} />
                <LinearGradient 
                    start={[ 1, 0 ]} 
                    end={[ 0, 0 ]} 
                    colors={ this.props.utils.theme.highlightGradient }
                    style={[ styles.customTrack, { width: `${this.state.progress * 100}%` } ]} 
                />                
                <Slider
                    value={ this.state.value }
                    style= { styles.container }
                    trackStyle={ styles.track }
                    thumbStyle={ styles.thumb }
                    minimumTrackTintColor={ 'transparent' }
                    maximumTrackTintColor={ 'transparent' }
                    minimumValue={ this.state.min }
                    maximumValue={ this.state.max }
                    step={ this.state.step }
                    onValueChange={ (value) => this.valueChange(value) } 
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    customTrack: {
        marginTop: 6,
        height: 8,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        borderRadius: 20
    },
    container: {
        height: 20,
        top: 0,
        left: 0,
        position: 'absolute',
        width: '100%',
    },
    track: {
        height: 8,
    },
    thumb: {
        backgroundColor: 'rgb(216, 216, 216)',
        borderRadius: 20,
        borderWidth: 0,
    },
});

export default connect(state => ({
    utils: state.utils 
}))(SliderComponent);
