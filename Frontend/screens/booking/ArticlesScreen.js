import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import 'react-native-gesture-handler';

import ArticleItem, { deviceWidth } from '../../components/Booking/ArticleItem';
import Search from '../../components/Booking/Search'
import * as articleActions from '../../store/actions/articles';
import Colors from '../../constants/Colors';

const deviceHeight = Dimensions.get('window').height;

console.disableYellowBox = true;

/**
 * This renders all the components together on the Articles Screen and initally displays just
 * the search bar and initial list of articles. It removes the initial list of articles when 
 * you press on the search bar and dynamically populates a new list using the Search component
 * and representing each article using the ArticleItem component
 * @param {*} props 
 */

const ArticlesScreen = (props) => {
  const [scrollYValue, setScrollYValue] = useState(new Animated.Value(0));
  const [searchedTerm, setSearchedTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const articles = useSelector(state => state.articles.availableArticles);
  const titles = useSelector(state => state.articles.availableTitles);
  const dispatch = useDispatch();

  /**
   * This React hook deals with refreshing and dispatching actions to the redux store in order to
   * load articles from the database
   */

  useEffect(() => {
    setShowResults(true);
    if (searchedTerm.length === 0) {
      setShowResults(false);
      setUsersList(titles);
    }
    setUsersList(titles.filter((name) => {
      return name.toLowerCase().includes(searchedTerm.toLowerCase())
    }));
    setIsLoading(true);
    dispatch(articleActions.fetchArticles()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch, searchedTerm]);

  // This checks if the screen is still loading articles from the database and displays a 
  // loading circle while the user waits for the articles to render on the screen

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  // If no articles were loaded from tne database it displays only this text on the screen,
  // nothing else is rendered.

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

  return (
    <Animated.View style={{
      backgroundColor: 'white',
      flex: 1,
    }}>
      <StatusBar barStyle="dark-content" backgroundColor='white' translucent={true} />
      <View style={{ height: Platform.OS === 'ios' ? StatusBar.currentHeight + 50 : 30 }}></View>
      <View style={{ position: 'relative' }}>
        {Platform.OS === 'ios' && (
          <Search
            titles={titles}
            searchedTerm={searchedTerm}
            setSearchedTerm={setSearchedTerm}
            clampedScroll={clampedScroll} 
          />
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
            <Search
              titles={titles}
              searchedTerm={searchedTerm}
              setSearchedTerm={setSearchedTerm}
              clampedScroll={clampedScroll}
            />
          )}
          {searchedTerm.length === 0 && titles.map((name, index) =>
            <ArticleItem navigation={props.navigation} key={index} name={name} />
          )}
          {(usersList.length === 0 && showResults) &&
            <Text style={{ textAlign: 'center', width: deviceWidth, fontSize: 18, paddingTop: 20 }}>
              No results for {searchedTerm}
            </Text>
          }
          {searchedTerm.length !== 0 && usersList.map((name, index) =>
            <ArticleItem navigation={props.navigation} key={index} name={name} />
          )}
          <View style={{ height: deviceHeight * 0.5 }}></View>
        </Animated.ScrollView>
      </View>
    </Animated.View>
  );

};

/**
 * This renders the menu hamburger icon on the top left of the screen as well as setting the header
 * title of the screen to Articles
 * @param {*} navData : navigation data from the BookingNavigator
 */

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

/**
 * The styles for the Article Screen component
 */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

});

export default ArticlesScreen;