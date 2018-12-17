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
    let {
      fee,
      workOrder,
      booking,
      event,
      feedback,
      communication,
      delivery,
      inbox,
      emailFee,
      emailWorkOrder,
      emailBooking,
      emailEvent,
      emailFeedback,
      emailCommunication,
      emailDelivery,
      emailInbox
    } = this.state.dataSetting;
    const setting = this.props.app.getSetting;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#F6F8FD' }}>
        <StatusBar barStyle="light-content" />
        {this.renderHeader()}
        <View style={{ padding: Resolution.scale(20) }}>
          <Text style={Styles.titleHeader}>Thông báo chi tiết</Text>
          <View
            style={{ backgroundColor: '#FFF', borderRadius: 5, padding: 20, paddingBottom: 0, justifyContent: 'space-between' }}
          >
            {/* Fee */}
            <ViewSwitch
              text={setting[0].displayName}
              noti={fee}
              email={emailFee}
              onToggleEmail={tugle => this.changeNoti('emailFee', tugle)}
              onToggle={tugle => this.changeNoti('fee', tugle)}
            />
            {/* WorkOrder */}
            <ViewSwitch
              text={setting[1].displayName}
              noti={workOrder}
              email={emailWorkOrder}
              onToggle={tugle => this.changeNoti('workOrder', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailWorkOrder', tugle)}
            />
            {/* Booking */}
            <ViewSwitch
              text={setting[2].displayName}
              noti={booking}
              email={emailBooking}
              onToggle={tugle => this.changeNoti('booking', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailBooking', tugle)}
            />
            {/* event */}
            <ViewSwitch
              text={setting[3].displayName}
              noti={event}
              email={emailEvent}
              onToggle={tugle => this.changeNoti('event', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailEvent', tugle)}
            />
            {/* FeedBack */}
            <ViewSwitch
              text={setting[5].displayName}
              noti={feedback}
              email={emailFeedback}
              onToggle={tugle => this.changeNoti('feedback', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailFeedback', tugle)}
            />
            {/* Communication ===> chat */}
            <ViewSwitch
              text={setting[6].displayName}
              noti={communication}
              email={emailCommunication}
              onToggle={tugle => this.changeNoti('communication', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailCommunication', tugle)}
            />
            {/* Delivery */}
            <ViewSwitch
              text={setting[7].displayName}
              noti={delivery}
              email={emailDelivery}
              onToggle={tugle => this.changeNoti('delivery', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailDelivery', tugle)}
            />
            {/* Inbox */}
            <ViewSwitch
              text={setting[8].displayName}
              noti={inbox}
              email={emailInbox}
              onToggle={tugle => this.changeNoti('inbox', tugle)}
              onToggleEmail={tugle => this.changeNoti('emailInbox', tugle)}
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
