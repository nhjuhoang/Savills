import React, { Component } from 'react';
import { Text, View, Dimensions, StyleSheet, Image } from 'react-native';
import moment from 'moment';
import Connect from '@stores';
const { width } = Dimensions.get('window');

class ItemComment extends Component {
  render() {
    const { content, creationTime, creatorUserId, fileUrl } = this.props.item;
    let id = this.props.idUser;
    let times = moment(creationTime).format('HH:mm:ss - DD-MM-YYYY');
    let encToken = this.props.account.encToken;
    let image = `${fileUrl}&encToken=${encodeURIComponent(encToken)}`;
    if (id == creatorUserId) {
      return (
        <View style={styles.contain}>
          <View style={styles.imageAvatar} />
          <View style={styles.viewChat}>
            <Text style={styles.textContent}>{content}</Text>
            <Text style={styles.textTime}>{times}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.containAdmin}>
          <Image style={{ width: 50, height: 50, borderRadius: 25 }} source={{ uri: image }} />
          <View style={[styles.viewChat, { backgroundColor: '#4A89E8' }]}>
            <Text style={[styles.textContent, { color: '#FFF' }]}>{content}</Text>
            <Text style={[styles.textTime, { color: 'rgba(255,255,255,0.5)' }]}>{times}</Text>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  contain: {
    width: width - 40,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row'
  },
  containAdmin: {
    width: width - 40,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row'
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderRadius: 18,
    marginVertical: 20
  },
  viewChat: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 5,
    padding: 20,
    marginLeft: 10
  },
  textContent: {
    color: '#515E6D',
    fontSize: 14,
    fontWeight: '600'
  },
  textTime: {
    marginTop: 5,
    color: 'rgba(69,79,102,0.5)',
    fontSize: 12
  }
});
export default Connect(ItemComment);
