import React from 'react';

import { connect } from 'react-redux';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient, DangerZone } from 'expo';

import { Header, HeaderButton } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import Slider from 'app/components/Slider';
import Fade from 'app/components/Fade';

import { Utils } from 'app/config';

const { scale } = Utils;
const { Lottie } = DangerZone;

const progressBar = require('app/assets/animations/passwordProgressBar.json');

class FreezeView extends React.Component {
    state = {
        accountID: false,
        account: false,
        selectedTron: 1,
        showContent: true,
        loading: false
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.props.navigation.navigate('DetailedView', { walletID: this.state.accountID }) } />,
    }

    componentWillMount() {
        const { accountID } = this.props.navigation.state.params;

        this.setState({
            account: this.props.wallets.accounts[accountID],
            accountID
        });
    }

    onSliderChange(selectedTron) {
        this.setState({
            selectedTron
        });
    }

    async toggleProgressBar(showContent = false) {
        if(showContent) {
            this.setState({ loading: false });

            await Utils.timeout(300);
            return this.setState({ showContent: true });
        }

        this.setState({ showContent: false });
        await Utils.timeout(300);

        this.setState({ loading: true });
        this.progressBar.play();
    }

    onPress() {
        const amount = this.state.selectedTron;

        const onConfirmation = async () => {
            this.toggleProgressBar();

            const result = await Utils.node.freeze(this.state.account, amount);

            if(!result || !result.result) {
                return Alert.alert(
                    'Broadcast Failed',
                    'Sorry, we failed to broadcast your transaction' + (result ? `: ${result.message}` : ''),
                    [
                        { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                    ],
                    { onDismiss: () => this.toggleProgressBar(true) }
                );
            }

            await Utils.reducers.refreshAccount(this.state.accountID, true);

            return Alert.alert(
                'Broadcast Success',
                'Your transaction was successfully broadcasted',
                [
                    { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                ],
                { onDismiss: () => this.toggleProgressBar(true) }
            )
        };

        Alert.alert(
            'Freeze Confirmation',
            'Are you sure you want to freeze ' + amount.toLocaleString() + ' TRX?',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => onConfirmation() }
            ]
        );
    }

    slider() {
        return (
            <View style={ styles.slider }>
                <View style={{ marginBottom: scale(30) }}>
                    <Slider min={ 1 } max={ this.state.account.balances.Tron } onValueChange={ amount => this.onSliderChange(amount) } />
                </View>
                <View style={ styles.sliderTextContainer }>
                    <Text style={ styles.sliderText }>
                        1 TRX
                    </Text>
                    <Text style={[ styles.sliderText, { textAlign: 'right' } ]}>
                        { this.state.account.balances.Tron.toLocaleString() } TRX
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        const { 
            accountID,
            account
        } = this.state;        

        return (
            <View style={{ flex: 1 }}>
                <LinearGradient 
                    start={[ 1, 0 ]} 
                    end={[ 0, 0 ]} 
                    colors={ this.props.utils.theme.highlightGradient } 
                    style={{ 
                        marginTop: -this.props.utils.statusHeight, 
                        paddingTop: this.props.utils.statusHeight,
                    }}
                >
                    <Header title={ 'Freeze Tron' } leftButton={ this.headerButtons.left } />
                    <View style={{ paddingBottom: scale(16.5), marginTop: scale(-20), alignItems: 'center' }}>
                        <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: scale(30), paddingBottom: scale(30) }}>
                            <Text style={{ fontFamily: 'source-code-pro', fontSize: scale(30), fontWeight: '500', color: '#eeeeee' }}>
                                { this.state.account.balances.Tron.toLocaleString() } TRX
                            </Text>                    
                        </View>
                        <Text style={{ color: 'white' }}>
                            You will receive 1 TronPower for every TRX frozen
                        </Text>
                    </View>
                </LinearGradient>
                <Fade visible={ this.state.showContent } style={{ flex: 1 }}>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ padding: 30, paddingBottom: 0, flex: 1 }}>   
                            <Text style={ styles.content }>
                                Freezing your Tron will convert the supplied tokens to TronPower. 
                                You can unfreeze TronPower 3 days after the most recent freeze
                            </Text>
                            { this.slider() }
                            <TouchableOpacity style={ styles.submitButton } onPress={ () => this.onPress() }>
                                <Text style={ styles.submitButtonText }>
                                    Freeze { this.state.selectedTron.toLocaleString() } Tron
                                </Text>
                            </TouchableOpacity>
                        </View>                    
                    </ScreenView>
                </Fade>
                <Fade visible={ this.state.loading } style={[ styles.loading, { marginBottom: this.props.utils.footerHeight } ]}>
                    <Lottie ref={ animation => {
                        this.progressBar = animation;
                    }} source={ progressBar } />
                </Fade>
            </View>   
        );
    }
}

const styles = StyleSheet.create({
    content: {
        marginBottom: scale(30),
        flexWrap: 'wrap',
        fontSize: scale(17),
        textAlign: 'center',
        color: '#cccccc'
    },
    slider: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: scale(20),
        borderRadius: 5
    },
    topLabel: {
        color: 'white',
        fontFamily: 'source-code-pro',
        textAlign: 'right',
        fontSize: scale(18),
        paddingTop: scale(10),
        paddingBottom: scale(10),
    },
    sliderText: {
        flex: 1,
        color: 'white',
        fontFamily: 'source-code-pro',
        fontSize: 15
    },
    sliderTextContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    submitButton: {
        marginTop: 15,
        borderRadius: 5,
        padding: 20,
        backgroundColor: '#0b0f12d1',
    },
    submitButtonText: {
        color: 'white',
        fontSize: scale(18),
        textAlign: 'center'
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(state => state)(FreezeView);