import React, { useEffect, useState, useReducer, useCallback, useMemo } from 'react';
import {
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Button,
  ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import 'react-native-gesture-handler';

import ArticleItem, { deviceWidth } from '../../components/Booking/ArticleItem';
import Search from '../../components/Booking/Search'
import { deviceHeight } from '../../components/Booking/Loader';
import * as articleActions from '../../store/actions/articles';
import Colors from '../../constants/Colors';



const ArticleDetailScreen = (props) => {
    //const articles = useSelector(state => state.articles.availableArticles);
    const selectedArticle = useSelector(state =>
        state.articles.availableArticles.find(article => article.title === props.route.params.title)
    );
    return (
    <ScrollView>
      <Text style={styles.price}>{selectedArticle.title}</Text>
      <Text style={styles.price}>{selectedArticle.author}</Text>
      <Text style={styles.price}>{selectedArticle.date}</Text>
      <Text style={styles.description}>{selectedArticle.description}</Text>
    </ScrollView>
  );
   

};

export const screenOptions = navData => {
    return {
      headerTitle: 'Article Details'
    };
};
  
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //alignItems: 'center',
  },
  price: {
    fontSize: 20,
    //color: '#888',
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
  
});
  
export default ArticleDetailScreen;