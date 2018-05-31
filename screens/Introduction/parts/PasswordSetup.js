import React from 'react';

import { connect } from 'react-redux';

import { Utils } from 'app/config';

import Password from 'app/components/Password';

const STAGES = {
    INITIAL_CODE: 0,
    REPEAT_CODE: 1,
    LOADING: 2
}

class PasswordSetup extends React.Component {
    state = {
        text: {
            info: 'Please enter a memorable code',
            error: ''
        },
        stage: STAGES.INITIAL_CODE,
        passwordMode: 4,
        repeatAttempted: false,
        walletName: '',
        walletMode: '',
        initialPassword: '',
    }

    componentWillMount() {
        const { walletMode, walletName } = this.props.navigation.state.params;

        this.setState({ 
            walletMode, 
            walletName 
        });
    }

    onReset(mode = this.state.passwordMode) {
        this.setState({
            text: {
                info: 'Please enter a memorable code',
                error: ''
            },
            stage: STAGES.INITIAL_CODE,
            passwordMode: mode,
            repeatAttempted: false,
            initialPassword: ''
        });
    }

    onPassword(password) {
        if(this.state.stage == STAGES.INITIAL_CODE)
            return this.onInitialPassword(password);

        if(this.state.stage == STAGES.REPEAT_CODE)
            return this.onRepeatPassword(password);
    }

    async onInitialPassword(password) {
        this.password.toggleLoading();

        this.setState({            
            stage: STAGES.REPEAT_CODE,
            initialPassword: password
        });

        await Utils.timeout(200);

        this.password.clear();
        this.password.toggleLoading();
        
        this.setState({
            text: {
                error: '',
                info: 'Please repeat the code'
            }
        }); 
    }

    async onRepeatPassword(password) {        
        const equalsInitial = password == this.state.initialPassword;
        this.password.toggleLoading();

        if(!equalsInitial && this.state.repeatAttempted) {
            this.setState({
                stage: STAGES.INITIAL_CODE,
                initialPassword: '',
                repeatAttempted: false
            });

            await Utils.timeout(200);

            this.password.clear();
            this.password.toggleLoading();

            return this.setState({
                text: {
                    error: 'We couldn\'t verify your code. Please enter a memorable code',
                    info: 'Please repeat the code'
                }
            });
        }
        
        if(!equalsInitial) {
            this.setState({
                repeatAttempted: true
            });

            await Utils.timeout(200);

            this.password.clear();
            this.password.toggleLoading();

            return this.setState({
                text: {
                    error: 'Please try repeating the code again',
                    info: ''
                }
            });
        }

        await Utils.timeout(200);

        this.setState({
            text: {
                error: '',
                info: 'Wallet creation complete'
            }
        });
    
        await Utils.timeout(200);
        this.props.navigation.navigate('WalletCreated', {
            password: this.state.initialPassword,
            passwordMode: this.state.passwordMode,
            walletMode: this.state.walletMode,
            walletName: this.state.walletName
        });
    }

    render() {
        return (
            <Password 
                mode={ this.state.passwordMode }
                onMode={ passwordMode => this.setState({ passwordMode }) }
                onPassword={ password => this.onPassword(password) }
                onReset={ mode => this.onReset(mode) }
                text={ this.state.text }
                theme={ this.props.utils.theme }
                ref={ instance => { this.password = instance } }
            />
        );
    }
}

export default connect(state => state)(PasswordSetup);