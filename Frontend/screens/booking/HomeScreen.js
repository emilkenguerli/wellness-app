import React from 'react';
import {
  View,
  FlatList,
  Text,
  Platform,
  StyleSheet,
  Image,
  TouchableHighlight
} from 'react-native';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient';

import Colors from '../../constants/Colors';

/**
 * This renders the navigation buttons on the Home Screen so that the user can use them to navigate to a
 * screen of their choice.
 * @param {*} props 
 */

const HomeScreen = (props) => {

  /**
   * Renders each indiviual tile of each navigation button 
   * @param {*} itemData : this is the data of each item in the list of navigations options
   */

  const renderGridItem = itemData => {
    return (
      <View style={styles.gridItem}>
        <TouchableHighlight
          style={{ flex: 1 }}
          activeOpacity={0.6}
          onPress={() => { props.navigation.navigate(itemData.item.title) }}>
          <View
            style={styles.container}
          >
            <Image
              source={{ uri: itemData.item.url }}
              style={styles.bgImage}
            />
            <Text style={styles.title}>
              {itemData.item.title}
            </Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  };


  return (
    <LinearGradient colors={['#e6e6fa', '#e6e6fa']} style={styles.screen} >
      <FlatList
        keyExtractor={item => item.key}
        data={[
          { title: "Calendar", url: 'https://freeiconshop.com/wp-content/uploads/edd/calendar-flat.png', key: "0" },
          { title: "Bookings", url: 'https://icons-for-free.com/iconfiles/png/512/checkmark+clipboard+document+list+tracklist+icon-1320167911544323810.png', key: "1" },
          { title: "Events", url: 'https://img.icons8.com/bubbles/2x/high-volume.png', key: "2" },
          { title: "Articles", url: 'https://www.iconarchive.com/download/i97950/thehoth/seo/seo-article.ico', key: "3" }
        ]}
        renderItem={renderGridItem}
        numColumns={2}
      />
    </LinearGradient>
  );

};

/**
 * This renders the menu hamburger icon on the top left of the screen as well as setting the header
 * title of the screen to 'Home'
 * @param {*} navData : navigation data from the BookingNavigator
 */

export const screenOptions = navData => {
  return {
    headerTitle: 'Home',
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
 * The styles for the Home Screen component
 */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  gridItem: {
    flex: 1,
    margin: 15,
    height: 150,
    borderRadius: 10,
    overflow:
      Platform.OS === 'android' && Platform.Version >= 21
        ? 'hidden'
        : 'visible',
    elevation: 5
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 22,
    textAlign: 'right'
  },
  container: {
    flex: 1,
    borderRadius: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    padding: 15,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: Colors.primary
  },
  bgImage: {
    width: '50%',
    height: '50%',

  }

});

export default HomeScreen;