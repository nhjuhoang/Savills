import React, { Component } from 'react';
import Connect from '@stores';
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  FlatList,
  Platform,
  ActivityIndicator,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
  RefreshControl,
  StatusBar
} from 'react-native';
import ScrollableTabView from '@components/react-native-scrollable-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import HeaderTitle from '@components/headerTitle';
import moment from 'moment';
import Header from '@components/header';
import IC_BACK from '@resources/icons/back-light.png';
import { isIphoneX } from '../../utils/func';
import IC_MENU from '@resources/icons/icon_tabbar_active.png';
const { width } = Dimensions.get('window');
import Resolution from '../../utils/resolution';
import Configs from '../../utils/configs';

const HEADER_MAX_HEIGHT = 70;
const HEADER_MIN_HEIGHT = 70;
class TabWorkOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listWorkOrder: [],
      isRefreshing: false,
      isRefreshingComplete: false,
      listWorkOrderComplete: [],
      scrollY: new Animated.Value(0),
      loadingMoreTabActive: false
    };
  }

  componentWillMount = async () => {
    let accessTokenApi = this.props.account.accessTokenAPI;
    const { id } = this.props.userProfile.profile.result.user;
    this.props.actions.workOrder.getWorkOrderList(accessTokenApi, 'ACTIVE', id);
    setTimeout(() => {
      this.props.actions.workOrder.getWorkOrderList(accessTokenApi, 'COMPLETED', id);
    }, 1000);
  };

  componentWillReceiveProps = nextProps => {
    if (
      nextProps.workOrder &&
      nextProps.workOrder.listActive &&
      nextProps.workOrder.listActive.success &&
      !nextProps.workOrder.isGetListWorkOrder
    ) {
      nextProps.actions.workOrder.setFlagGetWorkOrderList();
      this.setState({ listWorkOrder: nextProps.workOrder.listActive.result.items, isRefreshing: false });
    }
    if (
      nextProps.workOrder &&
      nextProps.workOrder.listComplete &&
      nextProps.workOrder.listComplete.success &&
      !nextProps.workOrder.isGetListWorkOrder
    ) {
      nextProps.actions.workOrder.setFlagGetWorkOrderList();
      this.setState({ listWorkOrderComplete: nextProps.workOrder.listComplete.result.items, isRefreshingComplete: false });
    }
  };

  handleScroll = event => {
    Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
      listener: event => {
        if (event.nativeEvent.contentOffset.y > 50) {
          if (!this.showCenter) {
            this.showCenter = true;
            this.setState({ isShowTitleHeader: true });
            // this.props.navigation.setParams({ eventTitle: 'Events' });
          }
        } else {
          if (this.showCenter) {
            this.showCenter = false;
            // this.props.navigation.setParams({ eventTitle: null });
            this.setState({ isShowTitleHeader: false });
          }
        }
      }
    })(event);
  };

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, 100, 286],
      outputRange: [60, 60, 0],
      extrapolate: 'clamp'
    });

    const fontSize = this.state.scrollY.interpolate({
      inputRange: [0, 100, 286],
      outputRange: [30, 30, 0],
      extrapolate: 'clamp'
    });
    const opacityText = this.state.scrollY.interpolate({
      inputRange: [0, 100, 286],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp'
    });

    const opacityText2 = this.state.scrollY.interpolate({
      inputRange: [0, 100, 286],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });

    const headerHeight2 = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });
    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={[{ height: headerHeight2 }]}>
          <Header
            LinearGradient={true}
            leftIcon={IC_BACK}
            leftAction={() => this.props.navigation.goBack()}
            headercolor={'transparent'}
            text="T1-A03-02"
            display={'text'}
            showTitleHeader={true}
            center={
              <View>
                <Animated.Text style={{ color: '#fFFF', fontFamily: 'OpenSans-Bold', opacity: opacityText2 }}>
                  Yêu Cầu
                </Animated.Text>
              </View>
            }
            rightAction={() => this._onpenModalSelectUnit()}
          />
        </Animated.View>
        <LinearGradient colors={['#4A89E8', '#8FBCFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flex: 1 }}>
          <Animated.View style={{ height: headerHeight, opacity: opacityText, paddingBottom: 10 }}>
            <Animated.Text
              style={{ fontSize: fontSize, fontFamily: 'OpenSans-Bold', color: '#FFF', marginLeft: 20, marginBottom: 0 }}
            >
              Yêu Cầu
            </Animated.Text>
          </Animated.View>
          <ScrollableTabView
            tabBarActiveTextColor={'#FFF'}
            tabBarInactiveTextColor={'rgba(255,255,255,0.5)'}
            tabBarUnderlineStyle={{ backgroundColor: '#FFF' }}
            tabBarBackgroundColor={'transparent'}
          >
            {this.ViewTwo(this.state.listWorkOrder)}
            {this.ViewThree(this.state.listWorkOrderComplete)}
          </ScrollableTabView>
        </LinearGradient>
        <View style={{ backgroundColor: '#FFF', width: width, height: isIphoneX() ? 60 : 40 }} />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('ModalWorkOrder', { profile: 'asd' })}
          style={{
            borderRadius: 25,
            width: 50,
            height: 50,
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
      </View>
    );
  }

  clickDetail = item => {
    this.props.navigation.navigate('ModalEditOrder', { id: item.id });
  };

  ViewTwo = list => {
    return (
      <View tabLabel="Đang xử lý" style={{ flex: 1, backgroundColor: '#F6F8FD', paddingHorizontal: 20 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.id.toString()}
          data={list}
          onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { y: this.state.scrollY } }
            }
          ])}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={() => this._onRefresh()}
              title={'Refrech Data !!'}
              tintColor="#000"
              titleColor="#000"
            />
          }
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ListEmptyComponent={() => {
            return (
              <View style={{ marginTop: 50 }}>
                <Text>Load Data !!</Text>
              </View>
            );
          }}
          // onEndReachedThreshold={0.01}
          // scrollEventThrottle={16}
          // onEndReached={() => this._onEndReached()}
          // legacyImplementation={false}
          // showsHorizontalScrollIndicator={false}
          // showsVerticalScrollIndicator={false}
          // ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
          ListFooterComponent={() => this._FooterFlatlist()}
        />
      </View>
    );
  };

  async _onEndReached() {
    if (this.state.loadingMoreTabActive) {
      return;
    }
    this.setState({ loadingMoreTabActive: true });
    let start = await this.state.listWorkOrder.length;
    let accessTokenAPI = this.props.account.accessTokenAPI;
    await this.props.actions.notification.getListNotification(accessTokenAPI, start);
  }

  _FooterFlatlist() {
    return (
      <View style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Configs.colorMain} />
      </View>
    );
  }

  _onRefresh() {
    let accessTokenApi = this.props.account.accessTokenAPI;
    const { id } = this.props.userProfile.profile.result.user;
    this.setState(
      {
        isRefreshing: true
      },
      () => {
        this.props.actions.workOrder.getWorkOrderList(accessTokenApi, 'ACTIVE', id);
      }
    );
  }

  _onRefreshTabComplete() {
    let accessTokenApi = this.props.account.accessTokenAPI;
    const { id } = this.props.userProfile.profile.result.user;
    this.setState(
      {
        isRefreshingComplete: true
      },
      () => {
        this.props.actions.workOrder.getWorkOrderList(accessTokenApi, 'COMPLETED', id);
      }
    );
  }

  ViewThree = list => {
    return (
      <View tabLabel="Hoàn tất" style={{ flex: 1, backgroundColor: '#F6F8FD', paddingHorizontal: 20 }}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => item.id.toString()}
          data={list}
          onScroll={Animated.event([
            {
              nativeEvent: { contentOffset: { y: this.state.scrollY } }
            }
          ])}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshingComplete}
              onRefresh={() => this._onRefreshTabComplete()}
              title={'Refrech Data !!'}
              tintColor="#000"
              titleColor="#000"
            />
          }
          renderItem={({ item, index }) => this.renderItem(item, index)}
          ListEmptyComponent={() => {
            return (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 }}>
                <Text style={{ color: '#515E6D', fontWeight: '500', fontSize: 18 }}>No data !!</Text>
              </View>
            );
          }}
        />
      </View>
    );
  };

  renderItem = (item, index) => {
    let date = moment(item.dateCreate).format('l');
    let time = moment(item.dateCreate).format('LT');
    return (
      <TouchableOpacity
        onPress={() => this.clickDetail(item)}
        key={item.id}
        style={{
          width: width - 40,
          height: 170,
          borderRadius: 10,
          marginTop: index === 0 ? 20 : 10,
          backgroundColor: '#FFF',
          padding: 20
        }}
      >
        <View style={{ flex: 1.5, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <View style={{ borderRadius: 5, backgroundColor: '#505E75' }}>
              <Text style={{ color: '#FFF', fontSize: 12, fontWeight: 'bold', marginVertical: 5, marginHorizontal: 15 }}>
                #{item.id}
              </Text>
            </View>
            <Text style={{ color: '#505E75', fontWeight: 'bold', fontSize: 13, marginTop: 12 }}>{item.fullUnitCode}</Text>
          </View>
          <Image
            style={{ width: 40, height: 40, borderRadius: 5 }}
            source={{ uri: 'http://imgt.taimienphi.vn/cf/Images/tt/2018/4/24/hinh-anh-che-13.jpg' }}
          />
        </View>

        <View
          style={{ flex: 1, marginVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ marginRight: 10, width: 15, height: 15 }} source={require('../../resources/icons/clock.png')} />
            <Text style={{ color: '#C9CDD4' }}>{time}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ marginRight: 10, width: 15, height: 15 }} source={require('../../resources/icons/calendar.png')} />
            <Text style={{ color: '#C9CDD4' }}>{date}</Text>
          </View>
          <View
            style={{
              borderRadius: 5,
              backgroundColor: item.currentStatus.colorCode
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 10, paddingVertical: 5, fontWeight: 'bold', paddingHorizontal: 15 }}>
              {item.currentStatus.codeName}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(186,191,200,0.5)',
            borderRadius: 5,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10
          }}
        >
          <Text style={{ flex: 1, color: '#FFF', fontSize: 12, fontWeight: 'bold' }} numberOfLines={1}>
            Tôi cần một dịch vụ quản lý thật tốt ...
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
}

export default Connect(TabWorkOrder);
