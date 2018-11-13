"use strict";

import React, { Component } from "react";
import {
    View,
    StyleSheet,
    Image,
    Text,
    Dimensions
} from "react-native";

import Resolution from "@utils/resolution";
import Utils from "../../utils";
import Configs from "../../utils/configs";
import Button from "../button";
import IC_PLUS from "../../resources/icons/plush-addnew.png";

import { ItemHome } from "../../components/placeHolder";

const { width, height } = Dimensions.get('window');

export default class ItemHomeComponent extends Component {

    render() {
        let moduleCount = this.props.moduleCount;
        let moduleName = this.props.moduleName;
        let moduleCountByItem = moduleCount && moduleCount.length > 0 ? moduleCount.find(e => e.moduleName === moduleName) : {}
        return (
            <View style={[Styles.container, { ...Configs.Shadow }]}>
                <ItemHome
                    txtWidth={70}
                    onReady={this.props.loading}
                    bgColor={'#FFF'}
                    animate='shine'>
                    <Button
                        activeOpacity={0.6}
                        onPress={() => this.props.onPressItem()}
                        style={{}}>
                        <View style={Styles.container}>
                            <Image source={Utils.mapItemHome(this.props.image)} />
                            <Text style={{ color: '#505E75', fontSize: 12, marginTop: Resolution.scaleHeight(10), fontFamily: 'OpenSans-Bold' }}>{this.props.title}</Text>
                            {
                                moduleCountByItem && moduleCountByItem.unreadCount > 0 ?
                                    <View style={{ backgroundColor: '#FFF', borderRadius: 10, position: 'absolute', top: (width - 60) / 8, right: (width - 60) / 8 }}>
                                        <View style={{ backgroundColor: '#FF361A', borderRadius: 10, margin: 3 }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: Resolution.scale(30) }}>
                                                <Text style={{ color: '#FFFFFF', fontFamily: 'OpenSans-Bold', fontSize: Resolution.scale(12) }}>{moduleCountByItem.unreadCount}</Text>
                                            </View>
                                        </View>
                                        {/* <View style={{ backgroundColor: '#FFF', borderRadius: 33, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: -8, top: -8 }}>
                                            <View style={{ backgroundColor: '#FF361A', borderRadius: 33, alignItems: 'center', justifyContent: 'center', margin: 2 }}>
                                                <View style={{ justifyContent: 'center', alignItems: 'center', width: 15, height: 15 }}>
                                                    <Image source={IC_PLUS} style={{ width: 10, height: 10 }} />
                                                </View>
                                            </View>
                                        </View> */}
                                    </View> : null
                            }
                            {/* <View style={{ backgroundColor: '#FF361A', borderRadius: 16, position: 'absolute', right: 10, top: 10}}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 15,  marginVertical: 1}}>
                                    <Text style={{ color: '#FFFFFF', fontFamily: 'OpenSans-Bold', fontSize: 13 }}>9s</Text>
                                </View>
                            </View> */}
                        </View>

                    </Button>
                </ItemHome>
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: (width - 60) / 2,
        height: (width - 60) / 2,
        backgroundColor: '#FFFFFF',
        margin: 10
    }
})
