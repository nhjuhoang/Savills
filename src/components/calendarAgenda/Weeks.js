import React from 'react';
import { View, Text, Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
const WEEK = ['日', '一', '二', '三', '四', '五', '六'];
const WEEK_en = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default ({ isChinese }) => {
  const week_localized = isChinese ? WEEK : WEEK_en;
  return (
    <View
      style={{
        width,
        height: 30,
        flexDirection: 'row'
      }}
    >
      {week_localized.map(day => (
        <View
          style={{
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          key={day}
        >
          <Text
            style={{
              color: '#FFF',
              fontSize: 12
            }}
          >
            {day}
          </Text>
        </View>
      ))}
    </View>
  );
};
