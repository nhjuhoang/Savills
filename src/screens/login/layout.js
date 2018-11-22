import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    Dimensions,
    KeyboardAvoidingView
} from 'react-native';

import ButtonCustom from "@components/buttonCustom";
import Button from "@components/button";
import InputText from "@components/inputText";
import LinearGradient from 'react-native-linear-gradient';
import Picker from 'react-native-wheel-picker';
import Modal from "react-native-modal";
import Resolution from "@utils/resolution";

import IC_EMAIL from "@resources/icons/ID.png";
import IC_PASS from "@resources/icons/password.png";

import IMG_LOGIN from "@resources/image/imgLogin.png";

import Loading from "@components/loading";
import Configs from "../../utils/configs";
import Style from "./style";

import Language from "../../utils/language";

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const { width, height } = Dimensions.get('window');

var PickerItem = Picker.Item;

export default class extends Component {

    onPickerSelect(index) {
        try {
            this.props.actions.app.setLanguageLocal(index.toString());
            this.setState({
                selectedItem: index,
            })
        } catch (error) {
            console.log(error)
        }

    }

    renderModalContent() {
        return (
            <View>
                <View style={Style.modalContent}>
                    <Text style={{ fontSize: 13, fontFamily: 'OpenSans-Bold', marginTop: 20 }}>Select Language</Text>
                    <Picker
                        style={{ width: width - 20, flex: 1, justifyContent: 'center', }}
                        selectedValue={parseInt(this.state.selectedItem)}
                        itemStyle={{ color: "#333333", fontSize: 20, fontWeight: 'bold' }}
                        onValueChange={(index) => this.onPickerSelect(index)}>
                        {
                            Language.listLanguage.map((item, index) => (
                                <PickerItem
                                    label={item.icon + ' ' + item.title}
                                    value={index}
                                    key={"id_" + index}
                                />
                            ))
                        }
                    </Picker>
                </View>
            </View>
        )
    };

    renderLoading() {
        if (this.state.loading) {
            return <Loading
                visible={this.state.loading}
                onRequestClose={() => { }}
            />
        }
        return null;
    }

    render() {
        let LG = Language.listLanguage[this.props.app.languegeLocal].data
        let iconFlag = Language.listLanguage[this.props.app.languegeLocal].icon
        return (
            <View style={Style.container}>
                <KeyboardAwareScrollView>
                    <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', height: height }}>
                        <View style={[Style.btnLanguage]}>
                            <ButtonCustom
                                background={'transparent'}
                                display='text'
                                haveMargin={false}
                                color={'#4A89E8'}
                                onPress={() => this._toggleModalLanguage()}
                                text={iconFlag + ' ' + LG.LOGIN_BTN_LANGUAGE}
                                fontFamily={'OpenSans-Regular'}
                            />
                        </View>
                        <View style={{ marginTop: 105 }}>
                            <Text style={Style.txtTop}>
                                {' Redefining Your Home \n Search Experience'}
                            </Text>
                            <Image source={IMG_LOGIN} style={{ marginTop: Resolution.scale(31), width: Resolution.scaleWidth(206), height: Resolution.scaleHeight(146) }} resizeMode={'contain'} />
                        </View>
                        <View>
                            {
                                this.props.account.error ?
                                    <Text style={{ color: '#FF361A', fontSize: Resolution.scale(10), alignSelf: 'center', marginBottom: 6, textAlign: 'center' }}>{this.props.account.error.message + '\n' + this.props.account.error.details}</Text> : null
                            }
                            <InputText
                                placeholder={LG.LOGIN_TXT_PLACEHOLDER_EMAIL}
                                iconLeft={IC_EMAIL}
                                keyboardType='email-address'
                                onChange={(data) => {
                                    this.setState({ username: data })
                                }}
                                style={this.props.account.error ? Style.errorTextinput : null}
                            />
                            <InputText
                                placeholder={LG.LOGIN_TXT_PLACEHOLDER_PASSWORD}
                                iconLeft={IC_PASS}
                                secureTextEntry
                                marginVertical={Resolution.scale(20)}
                                style={this.props.account.error ? Style.errorTextinput : null}
                                onChange={(data) => {
                                    this.setState({ password: data })
                                }}
                            />

                            <Button
                                onPress={() => this._login(this.state.username, this.state.password)}
                                style={{ ...Configs.ShadowButton }}
                            >
                                <LinearGradient
                                    colors={['#4A89E8', '#8FBCFF']}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                                    style={Style.btnLogin}
                                >
                                    <Text style={{ fontSize: Resolution.scale(15), color: '#FFFFFF', marginVertical: Resolution.scale(13), fontFamily: 'OpenSans-SemiBold' }}>{LG.LOGIN_BTN_LOGIN}</Text>
                                </LinearGradient>
                            </Button>

                            <View style={{ alignItems: 'center', marginVertical: Resolution.scale(30) }}>
                                <ButtonCustom
                                    background={'transparent'}
                                    display='text'
                                    fontSize={Resolution.scale(12)}
                                    haveMargin={false}
                                    color={'#BABFC8'}
                                    onPress={() => this._gotoForgotPassword()}
                                    text={LG.LOGIN_TXT_FORGOTPASSWORD + ' ?'}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <Modal
                    onBackdropPress={() => this._toggleModalLanguage()}
                    isVisible={this.state.isModalLanguage}
                    style={{
                        justifyContent: "flex-end",
                        margin: Resolution.scale(20),
                    }}
                >
                    {this.renderModalContent()}
                </Modal>
                {this.renderLoading()}
            </View>
        );
    }
}