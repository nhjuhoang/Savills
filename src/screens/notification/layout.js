import React, { Component } from 'react';
import { View, StyleSheet, Dimensions, FlatList, Image, Text, Animated, ActivityIndicator, Platform, StatusBar, RefreshControl } from 'react-native';
import Header from '@components/header';
import LinearGradient from 'react-native-linear-gradient';
import HeaderTitle from '@components/headerTitle';
import moment from 'moment';
import ModalSelectUnit from '@components/modalSelectUnit';
import Modal from 'react-native-modal';

import IC_BACK from '../../resources/icons/close.png';
import IC_CALENDAR from '../../resources/icons/calendar.png';
import IC_CLOCK from '../../resources/icons/clock.png';
import { } from '../';

import Configs from '../../utils/configs';
import Button from '../../components/button';

import IC_DROPDOWN from '@resources/icons/dropDown.png';
import IC_DEFAULT from '@resources/icons/default.png';

import Language from '../../utils/language';
import Resolution from '../../utils/resolution';

const { width } = Dimensions.get('window');

const HEADER_MAX_HEIGHT = Platform.OS == 'ios' ? 140 : 120;
const HEADER_MIN_HEIGHT = 75;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class extends Component {

  renderItem(item) {
    let state = item.state;
    let times = moment(item.notification.creationTime).format('LT');
    let date = moment(item.dateCreate).format('l');
    return (
      <View style={[Styles.item]}>
        {state === 0 ? <View style={{ backgroundColor: '#FF361A', position: 'absolute', top: Resolution.scale(20), right: Resolution.scale(20), width: Resolution.scale(8), height: Resolution.scale(8), borderRadius: 33 }} /> : null}
        <Button onPress={() => this._onClickItem(item)} style={{ alignItems: 'flex-start' }}>
          <View style={{ marginHorizontal: Resolution.scale(20) }}>
            <View style={{ flexDirection: 'row', marginTop: Resolution.scale(20), marginBottom: Resolution.scale(10), justifyContent: 'space-between' }}>
              <View style={{ backgroundColor: state === 0 ? '#505E75' : '#BABFC8', borderRadius: 5 }}>
                <Text style={{ color: '#F8F8F8', paddingVertical: Resolution.scale(2), paddingHorizontal: Resolution.scale(20), fontSize: Resolution.scale(13), fontFamily: 'OpenSans-SemiBold' }}>{`#${
                  item.notification.data.properties.Id
                  }`}</Text>
              </View>
            </View>
            <View>
              <Text style={{ color: state === 0 ? '#343D4D' : '#BABFC8', fontSize: Resolution.scale(14), fontFamily: 'OpenSans-SemiBold' }}>
                {`${item.notification.data.message}`}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginTop: Resolution.scale(10), marginBottom: Resolution.scale(20) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={IC_CLOCK} />
                <Text style={{ marginLeft: Resolution.scale(10), fontSize: Resolution.scale(12), color: '#C9CDD4', fontFamily: 'OpenSans-Regular' }}>{times}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: Resolution.scale(20) }}>
                <Image source={IC_CALENDAR} style={{}} />
                <Text style={{ marginLeft: Resolution.scale(10), fontSize: Resolution.scale(12), color: '#C9CDD4', fontFamily: 'OpenSans-Regular' }}>{date}</Text>
              </View>
            </View>
          </View>
        </Button>
      </View>
    );
  }

  _HeaderFlatlist() {
    let LG = Language.listLanguage[this.props.app.languegeLocal].data;
    return (
      <LinearGradient
        colors={['#4A89E8', '#8FBCFF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ width: width, marginBottom: Resolution.scale(20) }}
      >
        <HeaderTitle title={LG.NOTIFICATION_TXT_TITLE} />
      </LinearGradient>
    );
  }

  _FooterFlatlist() {
    return this.state.loadingMore ? (
      <View style={{ height: Resolution.scaleHeight(50), justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Configs.colorMain} />
      </View>
    ) : (
        <View style={{ height: Resolution.scaleHeight(20) }} />
      );
  }

  handleScroll = event => {
    Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
      listener: event => {
        if (event.nativeEvent.contentOffset.y > 50) {
          if (!this.showCenter) {
            this.showCenter = true;
            this.setState({ isShowTitleHeader: true });
          }
        } else {
          if (this.showCenter) {
            this.showCenter = false;
            this.setState({ isShowTitleHeader: false });
          }
        }
      }
    }, { useNativeDriver: true })(event);
  };

  renderHeader() {
    let unitActive = this.props.units.unitActive;
    let LG = Language.listLanguage[this.props.app.languegeLocal].data;
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });

    const opacity = this.state.scrollY.interpolate({
      inputRange: [0, 25, 50],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp'
    });

    return (
      <Animated.View style={{ height: headerHeight, position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' }}>
        <Header
          LinearGradient={true}
          leftIcon={IC_BACK}
          leftAction={() => this.props.onclose()}
          headercolor={'transparent'}
          showTitleHeader={this.state.isShowTitleHeader}
          center={
            <View>
              <Text style={{ color: '#fFFF', fontFamily: 'OpenSans-Bold' }}>{LG.NOTIFICATION_TXT_TITLE}</Text>
            </View>
          }
          renderViewRight={
            <Button
              onPress={() => this._openModalSelectUnit()}
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: Resolution.scale(20) }}
            >
              <Text style={{ fontFamily: 'OpenSans-Bold', color: '#FFF', fontSize: Resolution.scale(14) }}>{unitActive.fullUnitCode}</Text>
              <Image source={IC_DROPDOWN} style={{ marginLeft: Resolution.scale(10) }} />
            </Button>
          }
        />
        <LinearGradient
          colors={['#4A89E8', '#8FBCFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.View style={{ opacity: opacity }}>
            <HeaderTitle title={LG.NOTIFICATION_TXT_TITLE} />
          </Animated.View>
        </LinearGradient>
      </Animated.View>
    );
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#F6F8FD' }}>
        <StatusBar
          barStyle="light-content"
        />

        <FlatList
          data={this.state.data}
          horizontal={false}
          contentContainerStyle={{ alignItems: 'center', marginTop: HEADER_MAX_HEIGHT }}
          keyExtractor={(item, index) => item.id + '__' + index}
          renderItem={({ item, index }) => this.renderItem(item)}
          onScroll={this.handleScroll}
          onEndReachedThreshold={0.01}
          scrollEventThrottle={16}
          refreshing={this.state.isRefresh}
          onRefresh={() => this._onRefresh()}
          onEndReached={() => this._onEndReached()}
          legacyImplementation={false}
          extraData={this.state}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: Resolution.scaleWidth(20) }} />}
          ListHeaderComponent={() => <View style={{ height: Resolution.scaleHeight(20), }} />}
          ListFooterComponent={() => this._FooterFlatlist()}
        />

        {this.renderHeader()}



        <Modal style={{ flex: 1, margin: 0 }} isVisible={this.state.isModalSelectUnit}>
          <ModalSelectUnit onClose={() => this._closeModalSelectUnit()} />
        </Modal>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  item: {
    width: width - Resolution.scale(40),
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: Resolution.scale(20),
    marginVertical: Resolution.scale(5),
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden'
  }
});
