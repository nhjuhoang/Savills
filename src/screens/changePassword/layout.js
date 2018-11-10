import React, { Component } from 'react';
import {
    View,
    Text,
    Platform,
    KeyboardAvoidingView
} from 'react-native';

import Button from "@components/button";
import InputText from "@components/inputText";
import LinearGradient from 'react-native-linear-gradient';
import Loading from "@components/loading";
import Resolution from "../../utils/resolution";

import IC_EMAIL from "@resources/icons/ID.png";

import Style from "./style";

export default class extends Component {

    constructor(props) {
        super(props);
        this.state = {
            verifyCode: '',
            currPass: '',
            newPass: '',
            rePass: '',
            loading: false,
            flag: true,
            error: ''
        }
    }

    async componentWillReceiveProps(nextProps) {
        if (this.props.account.resetPassword !== nextProps.account.resetPassword && nextProps.account.resetPassword.success) {
            await this.setState({ loading: false, error: '' });
            await this._gotoLogin();
        }
        if (this.props.account.changePassword !== nextProps.account.changePassword && nextProps.account.changePassword.success) {
            await this.setState({ loading: false, error: '' });
            await this.props.navigation.goBack();
        }

        if (this.props.account.resetPassword !== nextProps.account.resetPassword && !nextProps.account.resetPassword.success) {
            await this.setState({ loading: false, error: nextProps.account.resetPassword.error.message });
        }

        if (this.props.account.changePassword !== nextProps.account.changePassword && !nextProps.account.changePassword.success) {
            await this.setState({ loading: false, error: nextProps.account.changePassword.error.message });
        }
    }

    _resetPassWord() {
        let { status } = this.props.navigation.state.params;
        let accessToken = this.props.account.accessToken;
        this.setState({ loading: true })
        if (!this.state.flag) {
            this.setState({ flag: true })
        }

        if (status !== 'forgot') {
            if (this.state.currPass === this.state.newPass) {
                this.setState({ loading: false, error: 'Current Password is not equal new password' })
                return;
            }
        }

        if (this.state.newPass !== this.state.rePass) {
            this.setState({ loading: false, error: 'password is not equal re-enter password' })
            return;
        } else {
            this.setState({ error: '' })
        }

        if (status === 'forgot') {
            this.props.actions.account.resetPassword(this.state.verifyCode, this.state.newPass)
        } else {
            this.props.actions.account.ChangePassword(accessToken, this.state.currPass, this.state.newPass);
        }



    }

    _gotoLogin() {
        this.props.navigation.navigate('Login')
    }

    renderLoading() {
        if (this.state.loading) {
            return <Loading
                visible={this.state.loading}
            />
        }
        return null;
    }

    render() {
        let { status } = this.props.navigation.state.params;
        let checkDisabled = status == 'forgot' &&
            this.state.verifyCode.length <= 0 || this.state.newPass.length <= 0 || this.state.rePass.length <= 0 ? true : false ||
                status == 'change' && this.state.currPass.length <= 0 || this.state.newPass.length <= 0 || this.state.rePass.length <= 0 ? true : false
        return (
            <View style={Style.container}>
                <View style={{ marginTop: Platform.OS === 'ios' ? 100 : 80 }}>
                    <Text style={Style.txtTop}>
                        {'Change Your Pass'}
                    </Text>
                </View>
                <KeyboardAvoidingView behavior="padding" enabled style={{ marginBottom: Resolution.scaleHeight(100) }}>
                    {
                        this.state.error.length > 0 ?
                            <Text style={{ color: '#FF361A', fontSize: 10, alignSelf: 'center' }}>{this.state.error}</Text> : null
                    }
                    <View style={{ marginVertical: Resolution.scaleHeight(20) }}>
                        {
                            status == 'forgot' ?
                                <InputText
                                    placeholder={'Verify Code'}
                                    onChange={(text) => this.setState({ verifyCode: text })}
                                    iconLeft={IC_EMAIL}
                                /> :
                                status == 'change' ?
                                    <InputText
                                        placeholder={'Current Password'}
                                        onChange={(text) => this.setState({ currPass: text })}
                                        iconLeft={IC_EMAIL}
                                        secureTextEntry
                                    /> : null
                        }

                    </View>
                    <InputText
                        placeholder={'New Password'}
                        iconLeft={IC_EMAIL}
                        onChange={(text) => this.setState({ newPass: text })}
                        secureTextEntry
                    />
                    <View style={{ marginVertical: Resolution.scaleHeight(20) }}>
                        <InputText
                            placeholder={'Retype Password'}
                            iconLeft={IC_EMAIL}
                            onChange={(text) => this.setState({ rePass: text })}
                            secureTextEntry
                        />
                    </View>
                    {

                    }
                    <Button
                        disabled={checkDisabled}
                        onPress={() => this._resetPassWord()}
                    >
                        <LinearGradient
                            colors={checkDisabled ? ['#CCCCCC', '#EEEEEE'] : ['#4A89E8', '#8FBCFF']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={{ alignItems: 'center', borderRadius: 33 }}
                        >
                            <Text style={{ fontSize: 15, color: '#FFFFFF', marginVertical: Resolution.scaleHeight(13), fontFamily: 'OpenSans-SemiBold' }}>Send</Text>
                        </LinearGradient>
                    </Button>
                </KeyboardAvoidingView>
                {this.renderLoading()}
            </View>
        );
    }
}