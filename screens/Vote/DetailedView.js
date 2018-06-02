import React from 'react';

import { View, Text, StyleSheet, TouchableOpacity, Image, StatusBar, FlatList, Alert } from 'react-native';
import { connect } from 'react-redux';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient, DangerZone } from 'expo';
import { Dropdown } from 'react-native-material-dropdown';

import { Utils } from 'app/config';
import { Header, HeaderButton } from 'app/components/Header';

import ScreenView from 'app/components/ScreenView';
import Fade from 'app/components/Fade';
import Slider from 'app/components/Slider';

const { scale } = Utils;
const { Lottie } = DangerZone;

const progressBar = require('app/assets/animations/passwordProgressBar.json');

class DetailedView extends React.Component {
    state = {
        selectedAccount: false,
        eligibleAccounts: {},
        tronPower: 1,
        showContent: true,
        loading: false
    }

    headerButtons = {
        left: <HeaderButton icon='arrow-back' onPress={ () => this.props.navigation.navigate('ListView') } />,
    }

    componentWillMount() {
        this.props = {
            ...this.props,
            ...this.props.navigation.state.params
        }

        const accounts = this.listEligibleAccounts();

        if(Object.keys(accounts).length) {
            this.setState({
                selectedAccount: Object.keys(accounts)[0],
                eligibleAccounts: accounts
            });
        }

        this.setState({ 
            witnessID: this.props.witnessID,
            witness: this.props.witnesses.witnessList[this.props.witnessID]
        });
    }

    componentWillReceiveProps() {
        const accounts = this.listEligibleAccounts();

        this.setState({
            eligibleAccounts: accounts
        });
    }

    listEligibleAccounts() {
        return Object.entries(this.props.wallets.accounts).filter(([ accountID, { balances } ]) => {
            return balances.TronPower > 0;  
        }).map(([ accountID, account ]) => account).sort((a, b) => {
            return b.balances.TronPower - a.balances.TronPower;  
        }).reduce((accounts, account) => {
            return accounts[account.accountID] = account, accounts;
        }, {})
    }

    chooseWallet(name) {
        this.setState({ 
            wallet: name 
        });
    };

    walletOptions() {
        return Object.entries(this.state.accounts).map(({ accountID, name }) => ({ accountID, name }));
    }

    onSliderChange(tronPower) {
        this.setState({
            tronPower
        });
    }

    tronPowerView() {
        const tronPower = Object.values(this.props.wallets.accounts).reduce((total, { balances }) => {
            return total + Number(balances.TronPower);
        }, 0);

        return (
            <View style={{ paddingBottom: scale(16.5), marginTop: scale(-20), alignItems: 'center' }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: scale(30), paddingBottom: scale(30) }}>
                    <Text style={{ fontFamily: 'source-code-pro', fontSize: scale(30), fontWeight: '500', color: '#eeeeee' }}>
                        { tronPower.toLocaleString() } TP
                    </Text>                    
                </View>
                <Text style={{ color: 'white' }}>
                    Earn more TronPower by freezing Tron
                </Text>
            </View>
        );
    }

    sliderView() {
        const account = this.props.wallets.accounts[this.state.selectedAccount];

        return (
            <View style={ styles.slider }>
                <View style={{ marginBottom: scale(30) }}>
                    <Slider min={ 1 } max={ account.balances.TronPower } onValueChange={ amount => this.onSliderChange(amount) } />
                </View>
                <View style={ styles.sliderTextContainer }>
                    <Text style={ styles.sliderText }>
                        1 TP
                    </Text>
                    <Text style={[ styles.sliderText, { textAlign: 'right' } ]}>
                        { account.balances.TronPower.toLocaleString() } TP
                    </Text>
                </View>
            </View>
        );
    }

    onDropdownChange(value) {
        this.setState({ selectedAccount: value });
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
        const account = this.props.wallets.accounts[this.state.selectedAccount];

        const { 
            witness, 
            tronPower 
        } = this.state;

        const onConfirmation = async () => {
            this.toggleProgressBar();

            const result = await Utils.node.witnessVote(account, {
                address: witness.address,
                count: tronPower
            });

            if(!result || !result.result) {
                return Alert.alert(
                    'Vote Failed',
                    'Sorry, we failed to cast your vote' + (result ? `: ${result.message}` : ''),
                    [
                        { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                    ],
                    { onDismiss: () => this.toggleProgressBar(true) }
                );
            }

            await Utils.reducers.refreshAccount(account.accountID, true);
            await Utils.reducers.refreshWitnesses();

            return Alert.alert(
                'Vote Success',
                'Your vote was successfully cast',
                [
                    { text: 'Dismiss', onPress: () => this.toggleProgressBar(true), style: 'cancel' }
                ],
                { onDismiss: () => this.toggleProgressBar(true) }
            )
        };

        Alert.alert(
            'Vote Confirmation',
            'Are you sure you want to vote for ' + witness.url + '? This will overwrite previous votes',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                { text: 'Yes', onPress: () => onConfirmation() }
            ]
        );
    }

    actionView() {
        const { 
            witnessID, 
            witness 
        } = this.state;

        const account = this.props.wallets.accounts[this.state.selectedAccount];

        const options = Object.values(this.state.eligibleAccounts).map(account => ({
            value: account.accountID,
            label: account.name
        }));

        return (
            <View>
                <Text style={ styles.votingText } numberOfLines={ 1 }>
                    { witness.url.toUpperCase() }
                </Text>
                <View style={ styles.dropdownContainer }>
                    <Dropdown 
                        value={ this.state.selectedAccount }
                        data={ options }
                        onChangeText={ value => this.onDropdownChange(value) }
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
                { this.sliderView() } 
                <TouchableOpacity style={ styles.submitButton } onPress={ () => this.onPress() }>
                    <Text style={ styles.submitButtonText }>
                        Submit { this.state.tronPower.toLocaleString() } votes
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    errorView() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: this.props.utils.footerHeight }}>
                <Text style={{ width: '80%', maxWidth: '80%', flexWrap: 'wrap', color: '#ffffff', fontSize: 17, textAlign: 'center' }}>
                    You do not have any eligible wallets to vote with. Freeze Tron to get started
                </Text>
            </View>
        )
    }

    render() {
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
                    <Header title={ 'Witness Vote' } leftButton={ this.headerButtons.left } />
                    { this.tronPowerView() }
                </LinearGradient>
                { this.state.selectedAccount && <Fade visible={ this.state.showContent } style={{ flex: 1 }}>
                    <ScreenView style={{ flex: 1 }}>
                        <View style={{ padding: 16.5, paddingBottom: 0, flex: 1 }}>   
                            { this.actionView() }
                        </View>   
                    </ScreenView>
                </Fade> }
                { <Fade visible={ this.state.loading } style={[ styles.loading, { marginBottom: this.props.utils.footerHeight } ]}>
                    <Lottie ref={ animation => {
                        this.progressBar = animation;
                    }} source={ progressBar } />
                </Fade> }
                { !this.state.selectedAccount && this.errorView() }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    dropdownContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 5,
        marginBottom: 16.5,
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
    votingText: {
        color: 'white',
        paddingTop: 7,
        marginBottom: 20,
        fontSize: 16,
        width: '100%',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    submitButton: {
        marginTop: 20,
        borderRadius: 5,
        padding: 20,
        backgroundColor: '#0b0f12d1',
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center'
    },
    votePower: {
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
    },
    sliderTextContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    loading: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default connect(state => ({ 
    witnesses: state.witnesses,
    wallets: state.wallets, 
    utils: state.utils 
}))(DetailedView);