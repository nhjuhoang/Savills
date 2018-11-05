"use strict";

import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Image,
    Text
} from "react-native";

import Resolution from "@utils/resolution";
import Utils from "../../utils";
import Configs from "../../utils/configs";
import Button from "../button";
import IC_DEFAULT from "@resources/icons/default.png";

export default class ItemHome extends Component {

    render() {
        return (
            <View style={[Styles.container, { ...Configs.Shadow }]}>
                {
                    this.props.loading ?
                        <Button
                            onPress={() => this.props.onPressItem()}
                            style={Styles.container}>
                            <Image source={Utils.mapItemHome(this.props.image)} />
                            <Text style={{ color: '#505E75', fontSize: 12, marginTop:Resolution.scaleHeight(10), fontFamily: 'OpenSans-Bold' }}>{this.props.title}</Text>
                        </Button>
                        :
                        <Image source={IC_DEFAULT} />
                }

            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 157,
        height: 157,
        backgroundColor: '#FFFFFF',
        margin: 10,

        // shadowColor: '#4A89E8',
        // shadowOpacity: 0.2,
        // shadowOffset: { width: 0, height: 3, },
        // shadowRadius: 1,
        // elevation: 2
    }
})
