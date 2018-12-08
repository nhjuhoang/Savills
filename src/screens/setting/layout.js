import React, { Component } from 'react';
import { View, Text, Animated, Image, StatusBar, Dimensions, ScrollView } from 'react-native';
import Header from '@components/header';
import IC_BACK from '@resources/icons/close.png';
import IC_DROPDOWN from '@resources/icons/dropDown.png';
import IC_ARROWRIGHT from '../../resources/icons/arrow_seemore.png';
import Button from '@components/button';
import ModalSelectUnit from '@components/modalSelectUnit';
import Modal from 'react-native-modal';
import ButtonSwitch from '../../components/buttonSwitch';
import HeaderTitle from '@components/headerTitle';
import Picker from 'react-native-wheel-picker';
import LinearGradient from 'react-native-linear-gradient';

import Resolution from '../../utils/resolution';

import Styles from './styles';

import Language from '@utils/language';

const { width, height } = Dimensions.get('window');

var PickerItem = Picker.Item;

export default class extends Component {
  renderHeader() {
    let unitActive = this.props.units.unitActive;
    return (
      <View>
        <Header
          LinearGradient={true}
          leftIcon={IC_BACK}
          leftAction={() => this.props.navigation.goBack()}
          headercolor={'transparent'}
          renderViewRight={
            <Button
              onPress={() => this.setState({ isModalSelectUnit: true })}
              style={{ flexDirection: 'row', alignItems: 'center', marginRight: Resolution.scale(20) }}
            >
              <Text style={{ fontFamily: 'OpenSans-Bold', color: '#FFF', fontSize: Resolution.scale(14) }}>
                {unitActive.fullUnitCode}
              </Text>
              <Image source={IC_DROPDOWN} style={{ marginLeft: Resolution.scale(10) }} />
            </Button>
          }
        />
        <LinearGradient colors={['#4A89E8', '#8FBCFF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
          <Animated.View style={{ height: 60 }}>
            <HeaderTitle title={'Settings'} />
          </Animated.View>
        </LinearGradient>
      </View>
    );
  }

  onPickerSelect(index) {
    try {
      this.props.actions.app.setLanguageLocal(index.toString());
      this.setState({
        selectedItem: index
      });
    } catch (error) {
      console.log(error);
    }
  }

  renderModalLanguage() {
    return (
      <View>
        <View style={Styles.modalContent}>
          <Text style={{ fontSize: Resolution.scale(13), fontFamily: 'OpenSans-Bold', marginTop: Resolution.scale(20) }}>
            Select Language
          </Text>
          <Picker
            style={{ width: width - Resolution.scaleWidth(20), flex: 1, justifyContent: 'center' }}
            selectedValue={parseInt(this.state.selectedItem)}
            itemStyle={{ color: '#333333', fontSize: Resolution.scale(20), fontWeight: 'bold' }}
            onValueChange={index => this.onPickerSelect(index)}
          >
            {Language.listLanguage.map((item, index) => (
              <PickerItem label={item.icon + ' ' + item.title} value={index} key={'id_' + index} />
            ))}
          </Picker>
        </View>
      </View>
    );
  }

  render() {
    let unitActive = this.props.units.unitActive;
    let {
      one,
      two,
      three,
      four,
      five,
      six,
      sevent,
      emailOne,
      emailTwo,
      emailThree,
      emailFour,
      emailFive,
      emailSix,
      emailSevent
    } = this.state.dataSetting;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F6F8FD' }}>
        <StatusBar barStyle="light-content" />
        {this.renderHeader()}

        {/* <View style={{ padding: Resolution.scale(20) }}>
          <Text style={Styles.titleHeader}>Thông báo chung</Text>
          <View
            style={{ backgroundColor: '#FFF', borderRadius: 5, padding: 20, paddingBottom: 0, justifyContent: 'space-between' }}
          >
            <ViewSwitch text={'Thông báo tất cả'} one onToggle={tugle => console.log('asdasdsadjklasjdklsadas', tugle)} />
            <ViewSwitch
              text={'Nhận email khi có thông báo'}
              one
              onToggle={tugle => console.log('asdasdsadjklasjdklsadas', tugle)}
            />
          </View>
        </View> */}

        {/* Thông báo chi tiết */}

        <View style={{ padding: Resolution.scale(20) }}>
          <Text style={Styles.titleHeader}>Thông báo chi tiết</Text>
          <View
            style={{ backgroundColor: '#FFF', borderRadius: 5, padding: 20, paddingBottom: 0, justifyContent: 'space-between' }}
          >
            <ViewSwitch
              text={'Thông báo phí'}
              noti={one}
              email={emailOne}
              onToggleEmail={tugle => this.changeNoti('emailOne', tugle)}
              onToggle={tugle => this.changeNoti('one', tugle)}
            />
            <ViewSwitch
              text={'Thông báo yêu cầu công việc'}
              noti={two}
              email={emailTwo}
              onToggle={tugle => this.changeNoti('two', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailTwo', tugle)}
            />
            <ViewSwitch
              text={'Thông báo đặt tiền ích'}
              noti={three}
              email={emailThree}
              onToggle={tugle => this.changeNoti('three', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailThree', tugle)}
            />
            <ViewSwitch
              text={'Thông báo sự kiện mới'}
              noti={four}
              email={emailFour}
              onToggle={tugle => this.changeNoti('four', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailFour', tugle)}
            />
            <ViewSwitch
              text={'Thông báo phản hồi'}
              noti={five}
              email={emailFive}
              onToggle={tugle => this.changeNoti('five', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailFive', tugle)}
            />
            <ViewSwitch
              text={'Thông báo khi có trả lời bình luận'}
              noti={six}
              email={emailSix}
              onToggle={tugle => this.changeNoti('six', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailSix', tugle)}
            />
            <ViewSwitch
              text={'Thông báo có hàng hóa kí gửi'}
              noti={sevent}
              email={emailSevent}
              onToggle={tugle => this.changeNoti('sevent', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailSevent', tugle)}
            />
          </View>
        </View>

        {/* ====== Thông báo chi tiết ======= */}
        <View style={{ padding: Resolution.scale(20) }}>
          <Text style={Styles.titleHeader}>Ngôn ngữ</Text>
          <Button onPress={() => this._toggleModalLanguage()} style={{ backgroundColor: '#FFF', borderRadius: 5 }}>
            <View
              style={{
                padding: Resolution.scale(20),
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center'
              }}
            >
              <Text>{Language.listLanguage[this.state.selectedItem].title}</Text>
              <Image source={IC_ARROWRIGHT} />
            </View>
          </Button>
        </View>

        <Modal style={{ flex: 1, margin: 0 }} isVisible={this.state.isModalSelectUnit}>
          <ModalSelectUnit onClose={() => this.setState({ isModalSelectUnit: false })} />
        </Modal>
        <Modal
          onBackdropPress={() => this._toggleModalLanguage()}
          isVisible={this.state.isModalLanguage}
          style={{
            justifyContent: 'flex-end',
            margin: Resolution.scale(20)
          }}
        >
          {this.renderModalLanguage()}
        </Modal>
      </ScrollView>
    );
  }

  changeNoti = (key, value) => {
    clearTimeout(this.timeOut);
    let accessTokenApi = this.props.account.accessTokenAPI;
    let temptUser = Object.assign({}, this.state.dataSetting);
    temptUser[key] = value;
    this.setState({
      dataSetting: temptUser
    });
    this.timeOut = setTimeout(() => {
      this.props.actions.app.updateSetting(accessTokenApi, this.state.dataSetting);
    }, 1000);
  };

  componentWillUnmount() {
    clearTimeout(this.timeOut);
  }
}

class ViewSwitch extends React.Component {
  render() {
    const { noti, onToggle, onToggleEmail, text, style, email } = this.props;

    return (
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: Resolution.scale(20)
          },
          { ...style }
        ]}
      >
        <Text style={{ color: '#505E75', fontFamily: 'OpenSans-Regular', fontSize: 13, flex: 1 }}>{text}</Text>
        <ButtonSwitch
          size={'small'}
          isOn={noti}
          onToggle={isOnDefaultToggleSwitch => {
            onToggle(isOnDefaultToggleSwitch);
          }}
        />
        <ButtonSwitch
          size={'small'}
          isOn={email}
          onToggle={isOnDefaultToggleSwitch => {
            onToggleEmail(isOnDefaultToggleSwitch);
          }}
        />
      </View>
    );
  }
}
