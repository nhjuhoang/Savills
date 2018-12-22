import React, { Component } from 'react';
import Connect from '@stores';
import {
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  Animated,
  Platform,
  ActivityIndicator
} from 'react-native';
import ScrollableTabView from '@components/react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import HeaderTitle from '@components/headerTitle';
import Modal from 'react-native-modal';
import Header from '@components/header';
import IC_BACK from '@resources/icons/back-light.png';

import IC_MENU from '@resources/icons/icon_tabbar_active.png';

import TabComplete from './tabs/tabComplete';
import TabInComming from './tabs/tabInComming';
import TabProcess from './tabs/tabProcess';
import configs from '../../utils/configs';
const { width } = Dimensions.get('window');
import { isIphoneX } from '../../utils/func';
import ModalSelectUnit from '../../components/modalSelectUnit';
import ModalNewBooking from './components/modalNewBooking';
import Resolution from '@utils/resolution';

import Button from '../../components/button';
import IC_DROPDOWN from '../../resources/icons/dropDown.png';

class TabBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCategory: false,
      listCategory: false,
      scrollY: new Animated.Value(0),
      isModalSelectUnit: false,
      isModalNewBooking: false,
      itemCategory: {}
    };
  }

  componentDidMount = () => {
    let ida = this.props.navigation.getParam('params', false);
    if (ida.itemtype) {
      this.props.navigation.navigate('ModalDetailBooking', { id: ida.itemtype });
    }
  };

  componentWillReceiveProps(nextProps) {
    let accessTokenApi = this.props.account.accessTokenAPI;
    if (nextProps.booking.listCategory && nextProps.booking.listCategory.success) {
      this.setState({ listCategory: nextProps.booking.listCategory.result });
    }
  }

  handleScroll = event => {
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
      {
        listener: event => {
          if (event.nativeEvent.contentOffset.y > 40) {
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
      },
      { useNativeDriver: true }
    )(event);
  };

  changeStatusBar = () => {
    if (this.state.isShowCategory || this.state.isModalSelectUnit) StatusBar.setHidden(true);
    else {
      StatusBar.setHidden(false);
    }
  };

  render() {
    let unitActive = this.props.units.unitActive;

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, 10, 40, 60],
      outputRange: [60, 40, 10, 0],
      extrapolate: 'clamp',
      useNativeDriver: true
    });

    const opacityText = this.state.scrollY.interpolate({
      inputRange: [0, 30, 60],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
      useNativeDriver: true
    });

    const headerTranslate = this.state.scrollY.interpolate({
      inputRange: [0, 30],
      outputRange: [0, -50],
      extrapolate: 'clamp'
    });

    const opacityTextHeader = this.state.scrollY.interpolate({
      inputRange: [0, 30],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <StatusBar barStyle="light-content" />
        <Header
          LinearGradient={true}
          leftIcon={IC_BACK}
          leftAction={() => this.props.navigation.goBack()}
          headercolor={'transparent'}
          showTitleHeader={true}
          center={
            <Animated.View style={{ opacity: opacityTextHeader }}>
              <Text style={{ color: '#fFFF', fontFamily: 'OpenSans-Bold' }}>Đặt tiện ích</Text>
            </Animated.View>
          }
          renderViewRight={
            <Button
              onPress={() => this.setState({ isModalSelectUnit: true })}
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}
            >
              <Text style={{ fontFamily: 'OpenSans-Bold', color: '#FFF', fontSize: 14 }}>{unitActive.fullUnitCode}</Text>
              <Image source={IC_DROPDOWN} style={{ marginLeft: 10 }} />
            </Button>
          }
        />
        <LinearGradient
          colors={['#4A89E8', '#8FBCFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: width, zIndex: -10 }}
        >
          <Animated.View
            style={{
              transform: [{ translateY: headerTranslate }],
              height: headerHeight
            }}
          >
            <Animated.View style={{ opacity: opacityText, position: 'absolute' }}>
              <HeaderTitle title={'Đặt tiện ích'} />
            </Animated.View>
          </Animated.View>
        </LinearGradient>
        <LinearGradient
          colors={['#4A89E8', '#8FBCFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, zIndex: 1 }}
        >
          <ScrollableTabView
            textStyle={{ fontSize: 12, fontFamily: 'OpenSans-SemiBold' }}
            tabBarActiveTextColor={'#FFF'}
            tabBarInactiveTextColor={'rgba(255,255,255,0.9)'}
            tabBarUnderlineStyle={{ backgroundColor: '#FFF' }}
            tabBarBackgroundColor={'transparent'}
          >
            <TabProcess onScroll={this.handleScroll} tabLabel={'Đang Xử Lý'} {...this.props} />
            <TabInComming onScroll={this.handleScroll} tabLabel={'Sắp Tới'} {...this.props} />
            <TabComplete onScroll={this.handleScroll} tabLabel={'Hoàn Tất'} {...this.props} />
          </ScrollableTabView>
        </LinearGradient>
        <View
          style={{
            backgroundColor: '#FFF',
            width: width,
            height: isIphoneX() ? 60 : 40,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.16
          }}
        />
        <TouchableOpacity
          onPress={() => this.clickShowCategory()}
          style={{
            borderRadius: 25,
            width: 50,
            height: 50,
            zIndex: 1,
            position: 'absolute',
            bottom: isIphoneX() ? 30 : 20,
            left: width / 2 - 25,
            backgroundColor: '#01C772',
            shadowColor: '#4DD49A',
            shadowOffset: { width: 3, height: 6 },
            shadowOpacity: 0.3,
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Image source={require('../../resources/icons/plush-addnew.png')} />
        </TouchableOpacity>
        {this.renderModalCategory()}
        <Modal style={{ flex: 1, margin: 0 }} isVisible={this.state.isModalNewBooking}>
          <ModalNewBooking
            goBack={() => this.setState({ isModalNewBooking: false })}
            changeCategory={() => this.changeCategory()}
            close={() => this.setState({ isModalNewBooking: false })}
            item={this.state.item}
          />
        </Modal>
        <Modal style={{ flex: 1, margin: 0 }} isVisible={this.state.isModalSelectUnit}>
          <ModalSelectUnit onClose={() => this.setState({ isModalSelectUnit: false })} />
        </Modal>
      </View>
    );
  }

  clickShowCategory = () => {
    let accessTokenApi = this.props.account.accessTokenAPI;
    this.setState({ isShowCategory: true, listCategory: false });
    setTimeout(() => {
      const buildingID = this.props.units.unitActive.buildingId;
      this.props.actions.booking.getListCategory(accessTokenApi, buildingID);
    }, 200);
  };

  changeCategory = () => {
    this.setState({ isModalNewBooking: false });
    setTimeout(() => {
      this.setState({ isShowCategory: true });
    }, 500);
  };

  renderModalCategory() {
    return (
      <Modal
        style={{ flex: 1, margin: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: isIphoneX() ? 40 : 20 }}
        isVisible={this.state.isShowCategory}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              width: width,
              height: 50,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              flexDirection: 'row',
              backgroundColor: '#FFF',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20
            }}
          >
            <TouchableOpacity onPress={() => this.setState({ isShowCategory: false })}>
              <Image source={require('../../resources/icons/close-black.png')} />
            </TouchableOpacity>
            <Text styl={{ color: '#505E75', fontSize: 14, fontFamily: 'OpenSans-Bold' }}>Choose Amenity</Text>
            <View />
          </View>
          <View style={{ flex: 1, backgroundColor: '#F6F8FD' }}>
            {this.state.listCategory ? (
              <FlatList
                data={this.state.listCategory}
                keyExtractor={(item, index) => item.amenityId.toString()}
                renderItem={({ item, index }) => (
                  <ItemCategory index={index} item={item} actins={() => this.gotoCreateBooking(item)} />
                )}
              />
            ) : (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={'large'} color={configs.colorMain} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  }

  gotoCreateBooking = item => {
    this.setState({ isShowCategory: false, item: item });
    setTimeout(() => {
      this.setState({ isModalNewBooking: true });
    }, 500);
  };
}

class ItemCategory extends Component {
  render() {
    const { amenityName, iconPath } = this.props.item;

    return (
      <TouchableOpacity
        onPress={() => this.props.actins()}
        style={{
          width: width - 40,
          height: 70,
          borderRadius: 10,
          backgroundColor: '#FFF',
          marginHorizontal: 20,
          marginTop: this.props.index === 0 ? 20 : 10,
          flexDirection: 'row',
          padding: 20,
          alignItems: 'center'
        }}
      >
        <Image
          style={{ width: 30, height: 30, marginRight: 10 }}
          resizeMode={'cover'}
          source={{ uri: configs.API_BOOKING + iconPath }}
        />
        <Text style={{ color: '#515E6D', fontSize: 14, fontWeight: '600' }}>{amenityName}</Text>
      </TouchableOpacity>
    );
  }
}

export default Connect(TabBooking);
