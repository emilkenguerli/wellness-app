import React from 'react';
import { Dimensions, View, Text, TouchableOpacity } from 'react-native';
export const deviceWidth = Dimensions.get('window').width;

const ArticleItem = (props) => (
  <View style={{
    height: 60,
    width: deviceWidth,
    marginLeft: 40,
    borderBottomWidth: 1,
    borderColor: '#DBDBDB',
    justifyContent: 'center'
  }}>
    <TouchableOpacity onPress={() => {props.navigation.navigate('ArticleDetails', {title: props.name})}}> 
      <Text style={{ fontSize: 18, fontWeight: '700' }}> {props.name}</Text>
    </TouchableOpacity>
  </View>
)

export default ArticleItem;