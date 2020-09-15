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
  Button
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


console.disableYellowBox = true;

const ArticlesScreen = (props) => {
    //const [articles, setArticles] = useState([]);
    //const [availableTitles, setAvailableTitles] = useState([]);
    const [scrollYValue, setScrollYValue] = useState(new Animated.Value(0));
    const [searchedTerm, setSearchedTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [currentDetails, setCurrentDetails] = useState({});
    const articles = useSelector(state => state.articles.availableArticles);
    const titles = useSelector(state => state.articles.availableTitles);
    const dispatch = useDispatch();
    console.log(articles);
    
    useEffect(() => {
      if (searchedTerm.length === 0) {
        setUsersList(titles);
      }
      setUsersList(titles.filter((name) => {
        return name.includes(searchedTerm)
      }));
      setIsLoading(true);
      dispatch(articleActions.fetchArticles()).then(() => {
        setIsLoading(false);
      });
    }, [dispatch, searchedTerm]);
  
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
  
    if (articles.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No articles currently available</Text>
        </View>
      );
    }
    

    const clampedScroll = Animated.diffClamp(
        Animated.add(
          scrollYValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolateLeft: 'clamp',
          }),
          new Animated.Value(0),
        ),
        0,
        50,
    );
          // return (
          //   <View></View>
          // )
    // useEffect(() => {
    //   console.log("hello");
    //     if (searchedTerm.length === 0) {
    //       return titles;
    //     }
    //     setUsersList(titles.filter((name) => {
    //       return name.includes(searchedTerm)
    //     }));
    //     //return list;
    //   }, [searchedTerm]);
    return (
        <Animated.View style={{
            backgroundColor: 'white',
            flex: 1,
          }}>
            <StatusBar barStyle="dark-content" backgroundColor='white' translucent={true} />
            <View style={{ height: Platform.OS === 'ios' ? StatusBar.currentHeight + 50 : 30 }}></View>
            <View style={{ position: 'relative' }}>
              {Platform.OS === 'ios' && (
                <Search titles={titles} searchedTerm={searchedTerm} setSearchedTerm={setSearchedTerm} clampedScroll={clampedScroll} />
              )}
              <Animated.ScrollView
                stickyHeaderIndices={Platform.OS === 'android' ? [0] : []}
                showsVerticalScrollIndicator={false}
                style={{
                  backgroundColor: 'white',
                  paddingTop: Platform.OS === 'ios' ? 70 : 0
                }}
                contentContainerStyle={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'space-around',
                  backgroundColor: 'white',
                }}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollYValue } } }],
                  { useNativeDriver: true },
                  () => { },          // Optional async listener
                )}>
                {Platform.OS === 'android' && (
                  <Search titles={titles} searchedTerm={searchedTerm} setSearchedTerm={setSearchedTerm} clampedScroll={clampedScroll} />
                )}
                {usersList.length === 0 && <Text style={{ textAlign: 'center', width: deviceWidth, fontSize: 18, paddingTop: 20 }}>No results for {searchedTerm}</Text>}
                {usersList.map((name, index) => <ArticleItem navigation={props.navigation} key={index} name={name} />)}
                <View style={{ height: deviceHeight * 0.5 }}></View>
              </Animated.ScrollView>
            </View>
          </Animated.View>
    );

};

export const screenOptions = navData => {
    return {
      headerTitle: 'Articles',
      headerLeft: () => (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
            title="Menu"
            iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
            onPress={() => {
            navData.navigation.toggleDrawer();
            }}
        />
        </HeaderButtons>
    )
    };
};
  
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //alignItems: 'center',
  },
  
});
  
export default ArticlesScreen;