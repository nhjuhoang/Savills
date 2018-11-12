import React, { Component } from 'react';
import { View, Text, Dimensions, Image, ScrollView, TouchableOpacity, TextInput, PixelRatio, FlatList } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import Header from '@components/header';
import IC_MENU from '@resources/icons/icon_tabbar_active.png';
import ImageViewer from 'react-native-image-zoom-viewer';
import HeaderTitle from '@components/headerTitle';
import { Calendar } from '../../../components/calendars';
import Resolution from '../../../utils/resolution';
import moment from 'moment';
import Modal from 'react-native-modal';
const { width } = Dimensions.get('window');
import Connect from '@stores';

class ModalDetailBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      loading: true,
      isShowModalCancel: false,
      listChat: [],
      chatText: ''
    };
  }

  componentDidMount = () => {
    let accessTokenApi = this.props.account.accessTokenAPI;
    let id = this.props.navigation.getParam('id', null);
    this.props.actions.booking.getDetailBooking(accessTokenApi, id);
  };

  async componentWillReceiveProps(nextProps) {
    let accessTokenApi = this.props.account.accessTokenAPI;
    if (
      nextProps.booking.detailBooking &&
      nextProps.booking.detailBooking.success &&
      this.props.booking.detailBooking != nextProps.booking.detailBooking
    ) {
      this.setState({ loading: false });
      this.props.actions.workOrder.getCommentUser(accessTokenApi, nextProps.booking.detailBooking.guid);
    }
    if (nextProps.workOrder.listComment && nextProps.workOrder.listComment.success) {
      this.setState({ listChat: nextProps.workOrder.listComment.result.items });
    }
    if (
      nextProps.booking.changeStatusBooking &&
      nextProps.booking.changeStatusBooking.success &&
      !nextProps.booking.isChangeStatus
    ) {
      nextProps.actions.booking.setFlagChangeStatus();
      this.props.actions.booking.getListBooking(accessTokenApi, 'ACTIVE');
      this.props.navigation.goBack();
    }
    if (
      nextProps.workOrder.addComment &&
      nextProps.workOrder.addComment.success &&
      this.props.workOrder.addComment != nextProps.workOrder.addComment
    ) {
      this.textInput.clear();
      this.props.actions.workOrder.getCommentUser(accessTokenApi, nextProps.booking.detailBooking.result.guid);
    }
  }

  addComment = () => {
    let accessTokenAPI = this.props.account.accessTokenAPI;
    const { displayName, profilePictureId } = this.props.userProfile.profile.result.user;
    let comment = {
      conversationId: this.props.booking.detailBooking.result.guid,
      content: this.state.chatText,
      typeId: null,
      isPrivate: false,
      userName: displayName,
      profilePictureId: profilePictureId,
      moduleId: 1
    };
    this.props.actions.workOrder.addCommentUser(accessTokenAPI, comment);
  };

  render() {
    return this.state.loading ? null : this.renderDetail();
  }

  renderDetail = () => {
    const {
      amenity,
      status,
      createdAt,
      fullUnitId,
      name,
      remark,
      reservationId,
      endDate,
      startDate
    } = this.props.booking.detailBooking.result;
    let date = moment(createdAt).format('l');
    return (
      <View style={{ flex: 1 }}>
        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1.0, y: 1.0 }} colors={['#4A89E8', '#8FBCFF']} style={{ height: 200 }}>
          <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20 }} onPress={() => this.props.navigation.goBack()}>
            <Image source={require('../../../resources/icons/close.png')} />
          </TouchableOpacity>
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 35, margin: 20, marginTop: 100 }}>#{reservationId}</Text>
        </LinearGradient>
        <ScrollView style={{ flex: 1, backgroundColor: '#F6F8FD', marginBottom: 70 }}>
          <ItemScorll
            title={'Dịch Vụ'}
            view={
              <View
                style={{
                  height: 70,
                  width: null,
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: '#FFF',
                  padding: 20,
                  alignItems: 'center',
                  flexDirection: 'row'
                }}
              >
                <Image
                  style={{ width: 30, height: 30 }}
                  source={{ uri: 'https://cdn4.iconfinder.com/data/icons/sports-balls/1024/Tennis_ball.png' }}
                />
                <Text style={{ color: '#343D4D', fontWeight: 'bold', fontSize: 13, flex: 1, marginLeft: 20 }}>
                  {amenity.amenityName}
                </Text>
              </View>
            }
          />
          <ItemScorll
            title={'Thông Tin'}
            view={
              <View
                style={{
                  height: 180,
                  width: null,
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: '#FFF',
                  padding: 20,
                  justifyContent: 'space-around'
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, color: '#505E75', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>Căn Hộ</Text>
                  <Text
                    style={{ color: '#BABFC8', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}
                  >{`${fullUnitId}-${name}`}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ flex: 1, color: '#505E75', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>Trạng Thái</Text>
                  <View
                    style={{
                      borderRadius: 5,
                      backgroundColor: status.colorCode
                    }}
                  >
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 13,
                        paddingVertical: 5,
                        fontFamily: 'OpenSans-SemiBold',
                        paddingHorizontal: 15
                      }}
                    >
                      {status.name}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, color: '#505E75', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>Ngày</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ marginRight: 10, width: 15, height: 15 }}
                        source={require('../../../resources/icons/calendar.png')}
                      />
                      <Text style={{ color: '#C9CDD4', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>{date}</Text>
                    </View>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, color: '#505E75', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>Thời gian</Text>
                  <Text style={{ color: '#BABFC8', fontFamily: 'OpenSans-SemiBold', fontSize: 13 }}>{`${moment(startDate).format(
                    'hh:mm'
                  )} - ${moment(endDate).format('hh:mm')}`}</Text>
                </View>
              </View>
            }
          />
          <ItemScorll
            title={'Miêu Tả'}
            view={
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                  width: null,
                  padding: 20,
                  minHeight: 100
                }}
              >
                <Text>{remark}</Text>
              </View>
            }
          />
        </ScrollView>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 100,
            right: 20
          }}
          onPress={() => this.setState({ isShowChat: true })}
        >
          <Image source={require('../../../resources/icons/chat-big.png')} />
          <View
            style={{
              width: 16,
              height: 16,
              backgroundColor: 'red',
              borderRadius: 8,
              position: 'absolute',
              top: 0,
              right: 0,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 8 }}> 1</Text>
          </View>
        </TouchableOpacity>
        {this.renderContentModalChat()}
        {this.renderModalCancel()}
        {this.renderFooter()}
      </View>
    );
  };

  renderContentModalChat() {
    return (
      <Modal style={{ flex: 1, margin: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: 50 }} isVisible={this.state.isShowChat}>
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
            <TouchableOpacity onPress={() => this.setState({ isShowChat: false })}>
              <Image source={require('../../../resources/icons/close-black.png')} />
            </TouchableOpacity>
            <Text>#676</Text>
            <View />
          </View>
          <View style={{ flex: 1, backgroundColor: '#F6F8FD', paddingBottom: 70 }}>
            <FlatList
              data={this.state.listChat}
              keyExtractor={(item, index) => item.id.toString()}
              renderItem={({ item, index }) => <ItemComment index={index} item={item} />}
            />
          </View>
          <LinearGradient
            colors={['#4A89E8', '#8FBCFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: width - 40,
              position: 'absolute',
              bottom: 20,
              left: 20,
              height: 50,

              borderRadius: 10
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
              <TextInput
                ref={input => {
                  this.textInput = input;
                }}
                style={{ flex: 1, color: '#FFF' }}
                onChangeText={e => this.setState({ chatText: e })}
                placeholderTextColor={'rgba(255,255,255,0.7)'}
                placeholder={'Nhập tin nhắn ...'}
              />
              <TouchableOpacity onPress={() => this.addComment()}>
                <Image source={require('../../../resources/icons/send-mess.png')} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  }

  renderModalCancel = () => {
    return (
      <Modal style={{ flex: 1, margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} isVisible={this.state.isShowModalCancel}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
          <View
            style={{
              width: width - 40,
              height: 120,
              borderRadius: 10,
              backgroundColor: '#FFF',
              marginHorizontal: 20,
              alignItems: 'center',
              padding: 20
            }}
          >
            <Text style={{ marginBottom: 20, color: '#BABFC8', fontFamily: 'Opensans-SemiBold', fontSize: 14 }}>
              Bạn muốn hủy sự kiện này
            </Text>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => this.setState({ isShowModalCancel: false })}
                style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 12, color: '#404040', fontFamily: 'Opensans-SemiBold' }}>Quay Lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.cancelBooking()}
                style={{
                  flex: 1,
                  marginLeft: 20
                }}
              >
                <LinearGradient
                  colors={['#01C772', '#01C772']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                >
                  <Text style={{ fontSize: 12, color: '#FFFFFF', fontFamily: 'Opensans-SemiBold' }}>Đồng ý</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  renderFooter = () => {
    return (
      <View style={{ position: 'absolute', width: width, height: 70, backgroundColor: '#FFF', bottom: 0, padding: 20 }}>
        <TouchableOpacity
          onPress={() => this.setState({ isShowModalCancel: true })}
          style={{ flex: 1, backgroundColor: '#404040', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>Hủy</Text>
        </TouchableOpacity>
      </View>
    );
  };

  cancelBooking = () => {
    let id = this.props.navigation.getParam('id', null);
    let accessTokenApi = this.props.account.accessTokenAPI;
    this.setState({ isShowModalCancel: false }, () => this.props.actions.booking.changeStatusBooking(accessTokenApi, id));
  };
}

class ItemScorll extends Component {
  render() {
    const { title } = this.props;
    return (
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <Text style={{ marginTop: 20, marginBottom: 10, color: '#505E75', fontSize: 14, fontWeight: 'bold' }}>{title}</Text>
        {this.props.view}
      </View>
    );
  }
}

class ItemComment extends Component {
  render() {
    const { content, creationTime } = this.props.item;
    let times = moment(creationTime).fromNow();
    return (
      <View style={{ width: width - 40, marginHorizontal: 20, marginVertical: 10, flexDirection: 'row' }}>
        <Image
          style={{ width: 36, height: 36, borderRadius: 18, marginVertical: 20 }}
          resizeMode={'cover'}
          source={{ uri: 'http://thuthuatphanmem.vn/uploads/2018/06/18/anh-avatar-dep-65_034122567.jpg' }}
        />
        <View style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 5, padding: 20, marginLeft: 20 }}>
          <Text style={{ color: '#515E6D', fontSize: 14, fontWeight: '600' }}>{content}</Text>
          <Text style={{ marginTop: 5, color: 'rgba(69,79,102,0.5)', fontSize: 12 }}>{times}</Text>
        </View>
      </View>
    );
  }
}

export default Connect(ModalDetailBooking);
