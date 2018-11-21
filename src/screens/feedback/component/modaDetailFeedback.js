import React, { Component } from 'react';

import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  PixelRatio,
  // Modal,
  Animated,
  Platform,
  FlatList,
  KeyboardAvoidingView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import Header from '@components/header';
import moment from 'moment';
import ItemComment from '@components/itemComment';
import HeaderTitle from '@components/headerTitle';
import Resolution from '../../../utils/resolution';
import Button from '@components/button';
import Connect from '@stores';
import { isIphoneX } from 'react-native-iphone-x-helper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

const HEADER_MAX_HEIGHT = Resolution.scale(140);
const HEADER_MIN_HEIGHT = Resolution.scale(Platform.OS === 'android' ? 50 : 70);
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

class ModalDetailFeedback extends Component {

  constructor(props) {
    super(props);
    this.state = {
      comment: '',
      scrollY: new Animated.Value(0),
      isShowTitleHeader: false,
      listTypeFeedback: this.props.feedback.typeFeedback.result,
      projectTypes: [
        { name: 'HO', value: 'HO' },
        { name: 'Project', value: 'PROJECT' }
      ],
      listCategory: this.props.feedback.listCategory.result || [],
      isShowCategory: false,
      type: '',
      typeProject: '',
      categorySelectedId: null,
      isShowModalConfirm: false,
      isShowChat: false,
      listComment: []
    };
  }

  handleScroll = event => {
    Animated.event([{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }], {
      listener: event => {
        if (event.nativeEvent.contentOffset.y > 60) {
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
    })(event);
  };

  _createFeedback(commentBoxSourceId = 3, commentBoxType = '') {
    this.setState({ loading: true })
    let accessTokenApi = this.props.account.accessTokenAPI;
    let unitActive = this.props.units.unitActive;
    let { id, username } = this.props.account.tenantActive;
    this.props.actions.feedback.createFeedback(accessTokenApi,
      commentBoxSourceId,
      unitActive.buildingId,
      id,
      username,
      unitActive.unitId,
      unitActive.fullUnitCode,
      this.state.categorySelectedId,
      this.state.comment,
      this.state.type
    );
  }

  _changeTypeFeedback(type) {
    this.setState({ type: type })
  }

  _changeProjectType(type) {
    this.setState({ typeProject: type })
  }

  _selectCategory(id) {
    this.setState({ categorySelectedId: id })
    if (this.state.isShowCategory) {
      this.setState({ isShowCategory: false })
    }
  }

  render() {
    const { itemSelected } = this.props;

    let date = moment(itemSelected && itemSelected.createdAt).format('l');
    let time = moment(itemSelected && itemSelected.createdAt).format('LT');

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp'
    });

    return (
      <View style={{ flex: 1, backgroundColor: '#F6F8FD' }}>
        <ScrollView
          alwaysBounceVertical={false}
          scrollEventThrottle={16}
          onScroll={this.handleScroll}
          contentContainerStyle={{ marginTop: HEADER_MAX_HEIGHT }}
          style={{ flex: 1, backgroundColor: '#F6F8FD' }}
        >
          {
            <ItemScorll
              title={'Thông Tin'}
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
                    <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>Loại phản hồi</Text>
                    <Text style={{ color: '#BABFC8', fontWeight: '500' }}>{itemSelected.commentBoxType.name}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>Vấn đề</Text>
                    <Text style={{ color: '#BABFC8', fontWeight: '500' }}>{itemSelected.commentBoxCategory.name}</Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>Trạng Thái</Text>
                    <View
                      style={{
                        borderRadius: 5,
                        backgroundColor: itemSelected.commentBoxStatus.colorCode
                      }}
                    >
                      <Text style={{ color: '#FFF', fontSize: 10, paddingVertical: 5, fontWeight: 'bold', paddingHorizontal: 15 }}>
                        {itemSelected.commentBoxStatus.name}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ flex: 1, color: '#505E75', fontWeight: '500' }}>Ngày Gửi</Text>
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
                        <Text style={{ color: '#C9CDD4' }}>{time}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                          style={{ marginRight: 10, width: 15, height: 15 }}
                          source={require('../../../resources/icons/calendar.png')}
                        />
                        <Text style={{ color: '#C9CDD4' }}>{date}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              }
            />
          }

          <ItemScorll
            title={'Miêu Tả'}
            view={
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#FFF',
                  borderRadius: 5,
                  width: null,
                  padding: 10,
                  minHeight: 100,
                  // marginBottom: rating > 0 && description != '' ? 0 : 200
                }}
              >
                <Text>{'dqweqwd'}</Text>
              </View>
            }
          />
        </ScrollView>

        <Animated.View style={{ height: headerHeight, position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' }}>
          <Header
            LinearGradient={true}
            leftIcon={require('../../../resources/icons/close.png')}
            leftAction={() => this.props.onClose()}
            headercolor={'transparent'}
            showTitleHeader={this.state.isShowTitleHeader}
            center={
              <View>
                <Text style={{ color: '#fFFF', fontFamily: 'OpenSans-Bold' }}>{'New Feedback'}</Text>
              </View>
            }
          />
          <LinearGradient
            colors={['#4A89E8', '#8FBCFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: width, paddingBottom: 20 }}
          >
            <HeaderTitle title={'# ' + itemSelected.commentBoxId} />
          </LinearGradient>
        </Animated.View>

        <Button
          style={{
            position: 'absolute',
            // bottom: this.state.detailOrder.currentStatus && this.state.detailOrder.currentStatus.id !== 11 ? 20 : 100,
            bottom: 50,
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
            <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 8 }}>
              {/* {this.props.workOrder.commentUnread.result[0].unreadCount} */}
            </Text>
          </View>
        </Button>

        {this.renderContentModalChat()}


      </View>
    );
  }

  renderContentModalChat() {
    let focusChat = {};
    // let id = this.props.userProfile.profile.result.user.id;
    return (
      <Modal style={{ flex: 1, margin: 0, backgroundColor: 'rgba(0,0,0,0.5)', paddingTop: 50 }} isVisible={this.state.isShowChat}>
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
        <ScrollView style={{ flex: 1, backgroundColor: '#FFF' }}>
          <KeyboardAwareScrollView extraScrollHeight={50} extraHeight={-250}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1, backgroundColor: '#F6F8FD', paddingBottom: 70 }}>
                <FlatList
                  data={this.state.listComment}
                  style={{ maxHeight: isIphoneX() ? 500 : height - 150, minHeight: isIphoneX() ? 500 : height - 150 }}
                  keyExtractor={(item, index) => item.id.toString()}
                  renderItem={({ item, index }) => <ItemComment index={index} item={item} idUser={id} />}
                  ListEmptyComponent={() => {
                    return (
                      <View style={{ flex: 1, alignItems: 'center', marginTop: 100, height: isIphoneX() ? 500 : height - 150 }}>
                        <Image source={require('../../../resources/icons/chat-big.png')} />
                        <Text
                          style={{ textAlign: 'center', color: '#BABFC8', marginTop: 10 }}
                        >{`Chưa có tin nào, nhắn thông tin \n cần trao đổi cho chúng tôi`}</Text>
                      </View>
                    );
                  }}
                />
              </View>
            </View>

          </KeyboardAwareScrollView>
        </ScrollView>
        <KeyboardAvoidingView behavior="position" enabled >
          <LinearGradient
            colors={['#4A89E8', '#8FBCFF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              {
                width: width - 40,
                position: 'absolute',
                bottom: 20,
                left: 20,
                height: 50,
                borderRadius: 10
              },
              focusChat
            ]}
          >
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20 }}>
              <TextInput
                ref={input => {
                  this.textInput = input;
                }}
                style={{ flex: 1, color: '#FFF' }}
                onChangeText={e => this.setState({ comment: e })}
                placeholderTextColor={'rgba(255,255,255,0.7)'}
                placeholder={'Nhập tin nhắn ...'}
              />
              <TouchableOpacity onPress={() => alert('send')}>
                <Image source={require('../../../resources/icons/send-mess.png')} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </Modal>
    );
  }

}

class ItemScorll extends Component {
  render() {
    const { title, view } = this.props;
    return (
      <View style={{ marginHorizontal: 20 }}>
        <Text style={{ marginTop: 20, marginBottom: 10, color: '#505E75', fontSize: 14, fontWeight: 'bold' }}>{title}</Text>
        {this.props.view}
      </View>
    );
  }
}

export default Connect(ModalDetailFeedback);
