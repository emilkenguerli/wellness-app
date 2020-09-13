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
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import 'react-native-gesture-handler';

import ArticleItem, { deviceWidth } from '../../components/Booking/ArticleItem';
import Search from '../../components/Booking/Search'
import { deviceHeight } from '../../components/Booking/Loader';

console.disableYellowBox = true;

const ArticlesScreen = (props) => {
    const [articles, setArticles] = useState([]);
    const [titles, setTitles] = useState([]);
    const [scrollYValue, setScrollYValue] = useState(new Animated.Value(0));
    const [searchedTerm, setSearchedTerm] = useState('');
  
    const getArticles = async () => {
        try{
            const response = await fetch(
              'http://192.168.50.136:9000/articles/'
            );
            
            const resData = await response.json();
            //console.log(resData.title)
            setArticles(resData);
            let temp = [];

            for(let i = 0; i < resData.length;i++){
                temp[i] = resData[i].title;
            };
            setTitles(temp);
                        
        }catch(error){
              throw error;
        }
    };
    
    getArticles();

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

    const usersList = useMemo(() => {
        if (searchedTerm.length === 0) {
          return titles;
        }
        const list = titles.filter((name) => {
          return name.includes(searchedTerm)
        });
        return list;
      }, [searchedTerm]);
    //console.log(titles);
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
                {usersList.map((name, index) => <ArticleItem key={index} name={name} />)}
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