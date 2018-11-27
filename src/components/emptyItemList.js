import React, { Component } from 'react';
import { Text, View, Dimensions, Image, ActivityIndicator } from 'react-native';
const { width, height } = Dimensions.get('window');
import { isIphoneX } from '@utils/func';

export class emptyItemList extends Component {
  render() {
    const { loadData } = this.props;
    return loadData ? (
      <View
        style={{
          marginTop: height / 2 - (isIphoneX() ? 100 : 150),
          width: width - 40,
          alignItems: 'center'
        }}
      >
        <ActivityIndicator color={'#CACACA'} size="large" />
      </View>
    ) : (
      <View
        style={{
          marginTop: height / 2 - (isIphoneX() ? 100 : 150),
          width: width - 40,
          alignItems: 'center'
        }}
      >
        <Text
          style={{ color: '#505E75', fontSize: 15, fontFamily: 'OpenSans-Bold', textAlign: 'center' }}
        >{`Bạn chưa dùng tiện ích nào \n chọn ngay cho mình dịch vụ tốt \n nhất ở đây nhé!`}</Text>
        <Image style={{ marginTop: 20, marginRight: 50 }} source={require('@resources/icons/addnew-pls.png')} />
      </View>
    );
  }
}

export default emptyItemList;
