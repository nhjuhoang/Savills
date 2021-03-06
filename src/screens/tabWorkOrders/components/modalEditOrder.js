import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Animated,
  Platform,
  Keyboard,
  StatusBar,
  Linking,
  DeviceEventEmitter
} from 'react-native';

import { ModalChat, Header, AnimatedTitle, Loading } from '@components';

import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import Connect from '@stores';
import moment from 'moment';
import Modal from 'react-native-modal';

import Configs from '@utils/configs';
import Resolution from '@utils/resolution';
const STAR_ON = require('@resources/icons/Star-big.png');
const STAR_OFF = require('@resources/icons/Star.png');

const HEADER_MAX_HEIGHT = Resolution.scale(60);

const { width, height } = Dimensions.get('window');

const options = {
  title: 'Select Image',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  },
  quality: 1,
  maxWidth: width, // photos only
  maxHeight: height // photos only
};

class ModalEditOrder extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detailOrder: false,
      imageIndex: 0,
      listComment: false,
      isShowChat: false,
      isShowRating: false,
      loading: true,
      vote: 0,
      description: '',
      commentRating: '',
      chatText: '',
      scrollY: new Animated.Value(Platform.OS === 'ios' ? -HEADER_MAX_HEIGHT : 0),
      isShowTitleHeader: false,
      showModalConfirmCancel: false,
      showImage: false,
      imageList: [],
      arrImageOld: [],
      marginBottom: 0
    };
    this._keyboardDidHide = this._keyboardDidHide.bind(this);
    this._keyboardDidShow = this._keyboardDidShow.bind(this);
  }

  componentDidMount = async () => {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    let accessTokenAPI = this.props.account.accessTokenAPI;
    let id = this.props.navigation.getParam('id', 0);
    let languages = this.props.app.listLanguage[this.props.app.languegeLocal].id;
    await this.props.actions.workOrder.detailWordOrder(accessTokenAPI, id, languages);
    this.props.actions.workOrder.getCommentUnread(accessTokenAPI, id, 2);
  };

  componentWillUnmount() {
    StatusBar.setHidden(false);
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow() {
    this.setState({ marginBottom: 300 });
  }

  _keyboardDidHide() {
    this.setState({ marginBottom: 0 });
  }

  changeStatusBar = () => {
    if (this.state.isShowChat || this.state.showModalConfirmCancel || this.state.isShowRating) StatusBar.setHidden(true);
    else {
      StatusBar.setHidden(false);
    }
  };

  componentWillReceiveProps = async nextProps => {
    let accessTokenAPI = this.props.account.accessTokenAPI;
    if (
      nextProps.workOrder.workOrderDetail &&
      nextProps.workOrder.workOrderDetail.success &&
      this.props.workOrder.workOrderDetail != nextProps.workOrder.workOrderDetail
    ) {
      this.setState({
        detailOrder: nextProps.workOrder.workOrderDetail.result,
        loading: false,
        description: nextProps.workOrder.workOrderDetail.result.description,
        arrImageOld: nextProps.workOrder.workOrderDetail.result.fileUrls
          ? nextProps.workOrder.workOrderDetail.result.fileUrls
          : []
      });
    }
    if (this.props.workOrder.listComment !== nextProps.workOrder.listComment && nextProps.workOrder.listComment.success) {
      this.setState({ listComment: nextProps.workOrder.listComment.result.items });
    }
    if (
      nextProps.workOrder.updateWorkOrder &&
      nextProps.workOrder.updateWorkOrder.success &&
      !nextProps.workOrder.isUpdateWorkOrder
    ) {
      nextProps.actions.workOrder.setFlagUpdateWorkOrder();
      this.setState({ loading: false });
      DeviceEventEmitter.emit('UpdateListWorkOrder', {});
      this.props.navigation.goBack();
    }
    if (
      nextProps.workOrder.addComment &&
      nextProps.workOrder.addComment.success &&
      this.props.workOrder.addComment != nextProps.workOrder.addComment
    ) {
      this.textInput.clear();
      this.props.actions.workOrder.getCommentUser(accessTokenAPI, nextProps.workOrder.workOrderDetail.result.guid);
    }
    if (
      nextProps.workOrder.uploadImage &&
      nextProps.workOrder.uploadImage.success &&
      this.props.workOrder.uploadImage != nextProps.workOrder.uploadImage
    ) {
      this.setState({ arrImageOld: this.state.arrImageOld.concat(nextProps.workOrder.uploadImage.result) });
    }
  };

  addComment = () => {
    if (this.state.chatText.trim() === '') {
      return;
    } else {
      this.setState({ chatText: '' });
      let accessTokenAPI = this.props.account.accessTokenAPI;
      const { displayName, profilePictureId } = this.props.userProfile.profile.result.user;
      let comment = {
        conversationId: this.props.workOrder.workOrderDetail.result.guid,
        content: this.state.chatText,
        typeId: null,
        isPrivate: false,
        userName: displayName,
        profilePictureId: profilePictureId,
        moduleId: 2
      };
      this.props.actions.workOrder.addCommentUser(accessTokenAPI, comment);
      // this.flatList.scrollToEnd({ animated: true });
    }
  };

  handleScroll = event => {
    Animated.event(
      [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
      {
        listener: event => {
          const offset = event.nativeEvent.contentOffset.y;
          this.state.scrollY.setValue(offset);
        }
      },
      { useNativeDriver: true }
    )(event);
  };

  renderModalCancel = languages => {
    return (
      <Modal
        style={{ flex: 1, margin: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: 50 }}
        isVisible={this.state.showModalConfirmCancel}
      >
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
              {languages.WO_CANCEL_ORDER}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => this.setState({ showModalConfirmCancel: false })}
                style={{ flex: 1, backgroundColor: '#FFF', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 12, color: '#404040', fontFamily: 'Opensans-SemiBold' }}>
                  {languages.WO_DETAIL_BACK}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.changeStatusWorkOrder(16)}
                style={{
                  flex: 1,
                  marginLeft: 20
                }}
              >
                <LinearGradient
                  colors={['#4A89E8', '#8FBCFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                >
                  <Text style={{ fontSize: 12, color: '#FFFFFF', fontFamily: 'Opensans-SemiBold' }}>
                    {languages.WO_DETAIL_APPROVE}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  changeStatusWorkOrder = idStatus => {
    this.setState({ loading: true, showModalConfirmCancel: false, isShowRating: false });
    const { fullUnitCode, buildingId, floorId, unitId } = this.props.units.unitActive;
    let accessTokenAPI = this.props.account.accessTokenAPI;
    const { name, id, phoneNumber, emailAddress, displayName } = this.props.userProfile.profile.result.user;
    let languages = this.props.app.listLanguage[this.props.app.languegeLocal].id;
    let WorkOrder = {
      id: this.state.detailOrder.id,
      guid: this.state.detailOrder.guid,
      currentStatusId: idStatus,
      createdUserFullName: displayName,
      updateUserFullName: '',
      fullUnitId: unitId,
      fullUnitName: `${fullUnitCode} - ${displayName}`,
      fullUnitCode: fullUnitCode,
      description: this.state.description,
      sourceId: 3,
      RatingComment: this.state.commentRating,
      rating: this.state.vote,
      dateCreate: this.state.detailOrder.dateCreate,
      maintainanceTeamId: 1,
      areaId: this.state.detailOrder && this.state.detailOrder.area ? this.state.detailOrder.area.id : 0,
      isPrivate: true,
      contact: {
        email: emailAddress,
        phoneNumber: phoneNumber,
        memberId: id
      }
    };
    this.props.actions.workOrder.updateWorkOrder(accessTokenAPI, WorkOrder, languages);
  };

  renderStartDetail = number => {
    let start = [];
    for (let i = 0; i < number; i++) {
      start.push(
        <Image key={i} style={{ width: 12, height: 12, margin: 2 }} source={require('../../../resources/icons/Star-big.png')} />
      );
    }
    for (let i = 0; i < 5 - number; i++) {
      start.push(
        <Image key={i + 10} style={{ width: 12, height: 12, margin: 2 }} source={require('../../../resources/icons/Star.png')} />
      );
    }
    return start;
  };

  getPhotos() {
    let ListImage = this.state.arrImageOld.slice();
    let accessTokenAPI = this.props.account.accessTokenAPI;
    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        const source = { uri: response.uri };
        const sourceBase64 = response.data;
        this.setState({
          arrImageOld: ListImage
        });
        this.props.actions.workOrder.uploadImageWorkOrder(
          accessTokenAPI,
          sourceBase64,
          this.props.workOrder.workOrderDetail.result.guid
        );
      }
    });
  }

  render() {
    const {
      fullUnitCode,
      currentStatus,
      dateCreate,
      rating,
      description,
      guid,
      area,
      ratingComment,
      employee
    } = this.state.detailOrder;
    let date = moment(dateCreate).format('l');
    let time = moment(dateCreate).format('LT');
    let tabIndex = this.props.navigation.getParam('tabIndex', false);
    {
      this.changeStatusBar();
    }

    let languages = this.props.app.listLanguage[this.props.app.languegeLocal].data;

    return (
      <View style={{ flex: 1, backgroundColor: '#F6F8FD' }}>
        {this.renderHeader(languages, tabIndex)}
        <KeyboardAwareScrollView
          scrollEventThrottle={16}
          contentContainerStyle={{
            paddingTop: Platform.OS !== 'ios' ? HEADER_MAX_HEIGHT : 0
          }}
          contentInset={{
            top: HEADER_MAX_HEIGHT
          }}
          contentOffset={{
            y: -HEADER_MAX_HEIGHT
          }}
          innerRef={ref => (this.scroll = ref)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          onScroll={this.handleScroll}
          enableOnAndroid
        >
          <ItemScorll
            title={languages.WO_DETAIL_INFO}
            view={
              <View
                style={{
                  height: 200,
                  width: null,
                  flex: 1,
                  borderRadius: 10,
                  backgroundColor: '#FFF',
                  padding: 20,
                  justifyContent: 'space-around'
                }}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>{languages.WO_DETAIL_APARTMENT}</Text>
                  <Text style={{ color: '#BABFC8', fontWeight: '500' }}>{fullUnitCode}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>{languages.WO_DETAIL_STATUS}</Text>
                  <View
                    style={{
                      borderRadius: 5,
                      backgroundColor: currentStatus ? currentStatus.colorCode : '#fff'
                    }}
                  >
                    <Text style={{ color: '#FFF', fontSize: 10, paddingVertical: 5, fontWeight: 'bold', paddingHorizontal: 15 }}>
                      {currentStatus ? currentStatus.codeName : ''}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>{languages.WO_DETAIL_DAYSEND}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                      <Image
                        style={{ marginRight: 10, width: 15, height: 15 }}
                        source={require('../../../resources/icons/clock.png')}
                      />
                      <Text style={{ color: '#C9CDD4' }}>{time || ''}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        style={{ marginRight: 10, width: 15, height: 15 }}
                        source={require('../../../resources/icons/calendar.png')}
                      />
                      <Text style={{ color: '#C9CDD4' }}>{date || ''}</Text>
                    </View>
                  </View>
                </View>
                {area && area.codeName ? (
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>{languages.WO_DETAIL_AREA}</Text>
                    <Text style={{ color: '#BABFC8', fontWeight: '500' }}>{area.codeName || ''}</Text>
                  </View>
                ) : null}
              </View>
            }
          />
          <ItemScorll
            title={languages.WO_DETAIL_PERSON}
            view={
              employee ? (
                <View
                  style={{
                    height: 90,
                    width: null,
                    flex: 1,
                    borderRadius: 10,
                    backgroundColor: '#FFF',
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    resizeMode={'cover'}
                    source={require('../../../resources/icons/avatar-default.png')}
                  />
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ flex: 1, marginLeft: 20, color: '#BABFC8' }}>{employee.fullName}</Text>
                    <Text style={{ flex: 1, marginLeft: 20, color: '#BABFC8' }}>{employee.phoneNumber}</Text>
                  </View>
                  <TouchableOpacity onPress={() => Linking.openURL(`tel:${employee.phoneNumber}`)}>
                    <Image source={require('../../../resources/icons/Call-button.png')} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    width: null,
                    flex: 1,
                    borderRadius: 10,
                    backgroundColor: '#FFF',
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                    resizeMode={'cover'}
                    source={require('../../../resources/icons/avatar-default.png')}
                  />
                  <Text style={{ flex: 1, marginLeft: 20, color: '#BABFC8' }}>{languages.WO_DETAIL_NOPERSON}</Text>
                  <Image source={require('../../../resources/icons/call-disable.png')} />
                </View>
              )
            }
          />

          {rating > 0 && ratingComment != '' ? (
            <ItemScorll
              title={languages.WO_DETAIL_REVIEWED}
              view={
                <View
                  style={{
                    flex: 1,
                    backgroundColor: '#FFF',
                    borderRadius: 5,
                    width: null,
                    padding: 20,
                    flexDirection: 'row',
                    alignItems: 'center'
                  }}
                >
                  <View>
                    <Text style={{ color: '#505E75', fontSize: 60, fontWeight: 'bold' }}>{rating}.0</Text>
                    <View style={{ flexDirection: 'row', alignSelf: 'center' }}>{this.renderStartDetail(rating)}</View>
                  </View>
                  <Text style={{ flex: 1, marginLeft: 10 }}>{ratingComment}</Text>
                </View>
              }
            />
          ) : null}

          <ItemScorll
            title={languages.WO_DETAIL_IMAGE}
            view={
              <ScrollView
                style={{
                  borderRadius: 10,
                  paddingTop: 10,
                  width: width - 40,
                  height: 130,
                  backgroundColor: '#FFF'
                }}
                showsHorizontalScrollIndicator={false}
                horizontal
              >
                {tabIndex && tabIndex === 1 ? null : (
                  <TouchableOpacity
                    onPress={() => this.getPhotos()}
                    style={{
                      width: 90,
                      height: 90,
                      marginLeft: 20,
                      borderRadius: 10,
                      margin: 10,
                      backgroundColor: '#F6F8FD',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        backgroundColor: '#FFF',
                        borderRadius: 25,
                        shadowColor: '#000',
                        shadowOffset: { width: 1, height: 2 },
                        shadowOpacity: 0.16,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Image
                        style={{ width: 25, height: 25 }}
                        resizeMode={'cover'}
                        source={require('@resources/icons/plus.png')}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                {this.state.arrImageOld.map((item, index) => this.renderItemImage(index, item))}
              </ScrollView>
            }
          />
          <ItemScorll
            title={languages.WO_DETAIL_DES}
            view={
              <TextInput
                style={{
                  flex: 1,
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                  height: 100,
                  width: null,
                  padding: 10,
                  paddingTop: 20,
                  marginBottom: 20
                }}
                returnKeyType="done"
                autoCapitalize="sentences"
                autoCorrect={true}
                onSubmitEditing={() => Keyboard.dismiss()}
                value={this.state.description}
                multiline
                placeholder={languages.WO_DETAIL_CONTENT}
                onChangeText={e => this.setState({ description: e })}
              />
            }
          />
          {/* </Animated.ScrollView> */}
        </KeyboardAwareScrollView>
        <Loading style={{ zIndex: 0 }} visible={this.state.loading} onRequestClose={() => {}} />
        {this.renderFooter(languages)}
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: currentStatus && (currentStatus.id == 11 || currentStatus.id == 13) ? 100 : 20,
            right: 20
          }}
          onPress={() =>
            this.setState({ isShowChat: true }, () => {
              let accessTokenAPI = this.props.account.accessTokenAPI;
              this.props.actions.workOrder.getCommentUser(accessTokenAPI, guid);
            })
          }
        >
          <Image source={require('@resources/icons/chat-big.png')} />
          {this.props.workOrder.commentUnread &&
          this.props.workOrder.commentUnread.success &&
          this.props.workOrder.commentUnread.result[0].unreadCount > 0 ? (
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
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 8 }}>
                {this.props.workOrder.commentUnread.result[0].unreadCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
        {this.state.loading ? null : this.renderContentModalChat(languages)}
        {this.state.loading ? null : this.renderModalRating(languages)}
        {this.state.loading ? null : this.renderModalCancel(languages)}
        {this.state.loading ? null : this.showDetailImage()}
      </View>
    );
  }

  renderHeader(languages, tabIndex) {
    const isShow = this.state.scrollY.interpolate({
      inputRange: [0, 60],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    let { id, currentStatus } = this.state.detailOrder;

    return (
      <View>
        <Header
          isModal
          LinearGradient={true}
          leftIcon={require('../../../resources/icons/close.png')}
          leftAction={() => this.props.navigation.goBack()}
          renderViewRight={
            tabIndex == 0 ? (
              <TouchableOpacity
                onPress={() => this.changeStatusWorkOrder(currentStatus ? currentStatus.id : 11)}
                style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}
              >
                <Text style={{ color: '#FFF', fontSize: 15, fontWeight: 'bold', marginRight: 20 }}>
                  {languages.WO_DETAIL_SAVE}
                </Text>
              </TouchableOpacity>
            ) : null
          }
          headercolor={'transparent'}
          showTitleHeader={true}
          center={
            <Animated.View style={{ opacity: isShow }}>
              <Text style={{ color: '#fFFF', fontFamily: 'OpenSans-Bold' }}>{`# ${id ? id : ''}`}</Text>
            </Animated.View>
          }
        />
        <AnimatedTitle scrollY={this.state.scrollY} label={`#${id ? id : ''}`} />
      </View>
    );
  }

  renderFooter = languages => {
    let tabIndex = this.props.navigation.getParam('tabIndex', false);
    let { currentStatus } = this.state.detailOrder;
    if (tabIndex == 0) {
      return (
        <View
          style={{
            width: width,
            height: 80,
            backgroundColor: '#FFF',
            padding: 20,
            flexDirection: 'row',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.16
          }}
        >
          <TouchableOpacity
            onPress={() => this.setState({ isShowRating: true })}
            style={{ flex: 1, backgroundColor: '#01C772', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>{languages.WO_DETAIL_COMPLETE}</Text>
          </TouchableOpacity>
          {currentStatus && currentStatus.id == 11 ? (
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: '#343D4D',
                borderRadius: 5,
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: 20
              }}
              onPress={() => this.setState({ showModalConfirmCancel: true })}
            >
              <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>{languages.WO_DETAIL_CANCEL}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      );
    } else {
      return null;
    }
  };

  renderItemImage = (index, item) => {
    let tabIndex = this.props.navigation.getParam('tabIndex', false);
    if (item.fileUrl) {
      let encToken = this.props.account.encToken;
      let image = `${item.fileUrl}&encToken=${encodeURIComponent(encToken)}`;
      return (
        <TouchableOpacity key={index} onPress={() => this.setState({ showImage: true, imageIndex: index })}>
          {tabIndex === 0 ? (
            <TouchableOpacity
              style={{ position: 'absolute', top: 0, right: 0, zIndex: 1 }}
              onPress={() => this.deleteImage(item, index)}
            >
              <Image style={{ width: 20, height: 20 }} source={require('@resources/icons/close-image.png')} />
            </TouchableOpacity>
          ) : null}
          <Image
            style={{ width: 90, height: 90, borderRadius: 10, margin: 10 }}
            resizeMode={'cover'}
            source={{
              uri: image
            }}
          />
        </TouchableOpacity>
      );
    }
  };

  deleteImage = (item, index) => {
    let accessTokenAPI = this.props.account.accessTokenAPI;
    let arrTemp = this.state.arrImageOld.slice();
    arrTemp.splice(index, 1);
    this.setState({ arrImageOld: arrTemp });
    this.props.actions.workOrder.deleteImageWorkOrder(accessTokenAPI, item.id);
  };

  voteProduct(data) {
    this.setState({
      vote: data
    });
  }

  renderOneStar = (data, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => this.voteProduct(data)} style={{ marginRight: 10 }}>
        <Image style={{ width: 34, height: 34, resizeMode: 'contain' }} source={data <= this.state.vote ? STAR_ON : STAR_OFF} />
      </TouchableOpacity>
    );
  };

  renderModalRating = languages => {
    return (
      <Modal style={{ flex: 1, margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} isVisible={this.state.isShowRating}>
        <KeyboardAwareScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: height / 2 - 200 }}>
            <View
              style={{
                width: width - 40,
                borderRadius: 10,
                alignSelf: 'center',
                backgroundColor: '#FFF',
                alignItems: 'center',
                padding: 20
              }}
            >
              <TouchableOpacity
                onPress={() => this.setState({ isShowRating: false })}
                style={{ position: 'absolute', top: 20, left: 20, padding: 10, zIndex: 1 }}
              >
                <Image source={require('@resources/icons/close-black.png')} />
              </TouchableOpacity>
              <Text style={{ color: '#505E75', fontSize: 60, fontWeight: '700' }}>
                {this.state.vote}
                .0
              </Text>
              <Text style={{ textAlign: 'center', color: '#BABFC8', marginTop: 10, fontSize: 14 }}>{`${
                languages.WO_REVIEW_SERVICE
              }`}</Text>
              <View
                style={{
                  width: width - 40,
                  height: 34,
                  marginVertical: 20,
                  backgroundColor: '#FFF',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {[1, 2, 3, 4, 5].map((data, index) => this.renderOneStar(data, index))}
              </View>
              <TextInput
                style={{
                  width: width - 80,
                  height: 80,
                  marginVertical: 20,
                  borderRadius: 10,
                  backgroundColor: '#FFF',
                  padding: 10,
                  paddingTop: 10
                }}
                placeholder={languages.WO_DETAIL_CONTENT_REVIEW}
                multiline
                returnKeyType="done"
                autoCapitalize="sentences"
                autoCorrect={true}
                onSubmitEditing={() => Keyboard.dismiss()}
                onChangeText={e => this.setState({ commentRating: e })}
              />
              <TouchableOpacity onPress={() => this.changeStatusWorkOrder(15)}>
                <LinearGradient
                  colors={['#4A89E8', '#8FBCFF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    borderRadius: 25,
                    width: width - 80,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14 }}>{languages.WO_DETAIL_SEND}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </Modal>
    );
  };

  showDetailImage() {
    const newData = [];
    let encToken = this.props.account.encToken;
    {
      this.state.arrImageOld && this.state.arrImageOld.length > 0
        ? this.state.arrImageOld.map(value => {
            if (value == null) {
              return;
            }
            if (value.fileUrl) {
              newData.push({ url: `${value.fileUrl}&encToken=${encodeURIComponent(encToken)}` });
            } else if (value.uri) {
              newData.push({ url: value.uri });
            } else {
              newData.push({ url: value });
            }
          })
        : null;
    }
    return (
      <Modal style={{ flex: 1, margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }} visible={this.state.showImage}>
        <ImageViewer imageUrls={newData} index={this.state.imageIndex} />
        <TouchableOpacity
          onPress={() => this.setState({ showImage: false })}
          style={{
            position: 'absolute',
            top: 35,
            left: 20,
            width: 50,
            height: 50
          }}
        >
          <Text
            style={{
              color: '#ffffff',
              fontSize: 18,
              backgroundColor: 'transparent'
            }}
          >
            Close
          </Text>
        </TouchableOpacity>
      </Modal>
    );
  }

  renderContentModalChat(languages) {
    let id = this.props.userProfile.profile.result.user.id;
    let tabIndex = this.props.navigation.getParam('tabIndex', false);
    let IdOrder = this.state.detailOrder.id;

    return (
      <ModalChat
        isVisible={this.state.isShowChat}
        title={IdOrder}
        idUser={id}
        chatEmpty={languages.WO_DETAIL_CHAT_EMPTY}
        placeholder={languages.WO_DETAIL_CHAT}
        listComment={this.state.listComment}
        editableTextInput={tabIndex && tabIndex == 1 ? false : true}
        disabledBtn={this.state.chatText.trim() === '' ? true : false}
        addComment={() => this.addComment()}
        onChangeText={text => this.setState({ chatText: text })}
        opacityBtnSend={this.state.chatText.trim() == '' ? 0.5 : 1}
        colors={tabIndex && tabIndex == 1 ? ['#DEDEDE', '#DEDEDE'] : ['#4A89E8', '#8FBCFF']}
        onClose={() => this.setState({ isShowChat: false })}
        refTextInout={input => {
          this.textInput = input;
        }}
      />
    );
  }
}

class ItemScorll extends PureComponent {
  render() {
    const { title, view } = this.props;
    return (
      <View style={{ flex: 1, marginHorizontal: 20 }}>
        <Text style={{ marginTop: 20, marginBottom: 10, color: '#505E75', fontSize: 14, fontWeight: 'bold' }}>{title}</Text>
        {this.props.view}
      </View>
    );
  }
}

export default Connect(ModalEditOrder);
