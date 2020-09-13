import React from 'react';
import { Dimensions, View, Text } from 'react-native';
export const deviceWidth = Dimensions.get('window').width;

const ArticleItem = ({ name }) => (
  <View style={{
    height: 60,
    width: deviceWidth,
    marginLeft: 40,
    borderBottomWidth: 1,
    borderColor: '#DBDBDB',
    justifyContent: 'center'
  }}>
    <Text style={{ fontSize: 18, fontWeight: '700' }}> {name}</Text>
  </View>
)

export default ArticleItem;