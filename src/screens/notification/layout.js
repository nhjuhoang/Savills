import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    FlatList,
    Image,
    Text,
    ActivityIndicator
} from 'react-native';
import Header from '@components/header';
import LinearGradient from 'react-native-linear-gradient';
import HeaderTitle from '@components/headerTitle';
import moment from 'moment';

import IC_BACK from "../../resources/icons/close.png";
import IC_CALENDAR from "../../resources/icons/calendar.png";
import IC_CLOCK from "../../resources/icons/clock.png";
import { } from "../";

import Configs from "../../utils/configs";
import Button from "../../components/button";

import IC_DEFAULT from "@resources/icons/default.png";

const { width } = Dimensions.get('window');

export default class extends Component {

    renderItem(item) {
        let state = item.state;
        let times = moment(item.notification.creationTime).format('LT');
        let date = moment(item.dateCreate).format('l');
        return <View style={[Styles.item, { ...Configs.Shadow }]}>
            <Button
                onPress={() => { }}
                style={{ alignItems: 'flex-start' }}>
                <View style={{ marginHorizontal: 20 }}>
                    <View style={{ flexDirection: 'row', marginTop: 20, marginBottom: 10, justifyContent: 'space-between' }}>
                        <View style={{ backgroundColor: state === 0 ? '#505E75' : '#BABFC8', borderRadius: 5, }}>
                            <Text style={{ color: '#F8F8F8', paddingVertical: 2, paddingHorizontal: 20 }}>{`#${item.notification.data.properties.Id}`}</Text>
                        </View>
                        {
                            state === 0 ?
                                <View style={{ backgroundColor: '#FF361A', width: 8, height: 8, borderRadius: 33 }} /> : null
                        }

                    </View>
                    <View>
                        <Text style={{ color: state === 0 ? '#343D4D' : '#BABFC8', fontSize: 14, fontFamily: 'OpenSans-SemiBold' }}>
                            {`${item.notification.data.message}`}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={IC_CLOCK} />
                            <Text style={{ marginLeft: 10, fontSize: 12, color: '#C9CDD4', fontFamily: 'OpenSans-Regular' }}>
                                {times}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 20 }}>
                            <Image source={IC_CALENDAR} style={{}} />
                            <Text style={{ marginLeft: 10, fontSize: 12, color: '#C9CDD4', fontFamily: 'OpenSans-Regular' }}>
                                {date}
                            </Text>
                        </View>
                    </View>
                </View>
            </Button>
        </View>
    }

    _HeaderFlatlist() {
        return (
            <LinearGradient
                colors={['#4A89E8', '#8FBCFF']}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={{ width: width, marginBottom: 20 }}>
                <HeaderTitle title='Notification' />
            </LinearGradient>
        )
    }

    _FooterFlatlist() {
        return (
            this.state.loadingMore ?
                <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator
                        size="large"
                        color={Configs.colorMain}
                    />
                </View> : <View style={{ height: 20 }} />
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#F6F8FD' }}>
                <Header
                    LinearGradient={true}
                    leftIcon={IC_BACK}
                    leftAction={() => this.props.onclose()}
                    headercolor={'transparent'}
                />
                <FlatList
                    data={this.state.data}
                    horizontal={false}
                    contentContainerStyle={{ alignItems: 'center', }}
                    keyExtractor={(item, index) => item.id + '__' + index}
                    renderItem={({ item, index }) => (
                        this.renderItem(item)
                    )}
                    // onScroll={this.handleScroll}
                    onEndReachedThreshold={0.5}
                    onEndReached={this._onEndReached()}
                    legacyImplementation={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                    ListHeaderComponent={() => this._HeaderFlatlist()}
                    ListFooterComponent={() => this._FooterFlatlist()}
                />
            </View>
        );
    }

}


const Styles = StyleSheet.create({
    item: {
        width: width - 40,
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginVertical: 5
    }
})