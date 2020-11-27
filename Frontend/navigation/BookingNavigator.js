import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  createDrawerNavigator,
  DrawerItemList
} from '@react-navigation/drawer';
import { Platform, SafeAreaView, Button, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import AuthScreen, {
  screenOptions as authScreenOptions
} from '../screens/user/AuthScreen';
import ForgotPassword, {
  screenOptions as forgotPasswordScreenOptions
} from '../screens/user/ForgotPasswordScreen';
import HomeScreen, {
  screenOptions as HomeScreenOptions
} from '../screens/booking/HomeScreen';
import CalendarScreen, {
  screenOptions as calendarScreenOptions
} from '../screens/booking/CalendarScreen';
import OptionsScreen, {
  screenOptions as optionsScreenOptions
} from '../screens/booking/OptionsScreen';
import BookingsScreen, {
  screenOptions as bookingsScreenOptions
} from '../screens/booking/BookingsScreen';
import CancelScreen, {
  screenOptions as cancelScreenOptions
} from '../screens/booking/CancelScreen'
import EventsScreen, {
  screenOptions as eventsScreenOptions
} from '../screens/booking/EventsScreen';
import ArticlesScreen, {
  screenOptions as articlesScreenOptions
} from '../screens/booking/ArticlesScreen';
import ArticleDetailScreen, {
  screenOptions as articleDetailScreenOptions
} from '../screens/booking/ArticleDetailScreen'; 
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

/**
 * These are the default screen options for the head title of the screen that
 * all the screens in the app get
 */

const defaultNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primary : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primary
};

const HomeStackNavigator = createStackNavigator();

/**
 * The navigator for the Home Screen
 */

export const HomeNavigator = () => {
  return (
    <HomeStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <HomeStackNavigator.Screen
        name="Home"
        component={HomeScreen}
        options={HomeScreenOptions}
      />
    </HomeStackNavigator.Navigator>
  );
};

const CalendarStackNavigator = createStackNavigator();

/**
 * The navigator for the Calendar and Options screens
 */

export const CalendarNavigator = () => {
  return (
    <CalendarStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <CalendarStackNavigator.Screen
        name="Calendar"
        component={CalendarScreen}
        options={calendarScreenOptions}
      />
      <CalendarStackNavigator.Screen
        name="Options"
        component={OptionsScreen}
        options={optionsScreenOptions}
      />
    </CalendarStackNavigator.Navigator>
  );
};

const BookingsStackNavigator = createStackNavigator();

/**
 * The navigator for the Bookings Screen
 */

export const BookingsNavigator = () => {
  return (
    <BookingsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <BookingsStackNavigator.Screen
        name="Bookings"
        component={BookingsScreen}
        options={bookingsScreenOptions}
      />
      <CalendarStackNavigator.Screen
        name="Cancel"
        component={CancelScreen}
        options={cancelScreenOptions}
      />
    </BookingsStackNavigator.Navigator>
  );
};

const EventsStackNavigator = createStackNavigator();

/**
 * The navigator for the Events Screen
 */

export const EventsNavigator = () => {
  return (
    <EventsStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <EventsStackNavigator.Screen
        name="Events"
        component={EventsScreen}
        options={eventsScreenOptions}
      />
    </EventsStackNavigator.Navigator>
  );
};

const ArticlesStackNavigator = createStackNavigator();

/**
 * The navigator for the Articles and ArticleDetails screens
 */

export const ArticlesNavigator = () => {
  return (
    <ArticlesStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <ArticlesStackNavigator.Screen
        name="Articles"
        component={ArticlesScreen}
        options={articlesScreenOptions}
      />
      <ArticlesStackNavigator.Screen
        name="ArticleDetails"
        component={ArticleDetailScreen}
        options={articleDetailScreenOptions}
      />
    </ArticlesStackNavigator.Navigator>
  );
};

const ShopDrawerNavigator = createDrawerNavigator();

/**
 * This compiles all the navigators and handles which one is show depending on how the user 
 * interacts with the navigation tools. It also gives every screen except Options and
 * ArticleDetails screens a position in the drawer menu. This menu bar has all the screens 
 * listed on it as well as a logout button at the bottom
 */

export const BookingNavigator = () => {
  const dispatch = useDispatch();

  return (
    <ShopDrawerNavigator.Navigator
      drawerContent={props => {
        return (
          <View style={{ flex: 1, paddingTop: 20, flexDirection: 'column', justifyContent: 'space-between' }}>
            <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
              <DrawerItemList {...props} />             
            </SafeAreaView>
            <View style={{marginVertical: 15, padding: 10}}>
              <Button
                  title="Logout"
                  color={Colors.primary}
                  onPress={() => {
                    dispatch(authActions.logout());
                  }}
              />
            </View>
          </View>
        );
      }}
      drawerContentOptions={{
        activeTintColor: Colors.primary
      }}
    >
      <ShopDrawerNavigator.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Calendar"
        component={CalendarNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Bookings"
        component={BookingsNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Events"
        component={EventsNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
      <ShopDrawerNavigator.Screen
        name="Articles"
        component={ArticlesNavigator}
        options={{
          drawerIcon: props => (
            <Ionicons
              name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
              size={23}
              color={props.color}
            />
          )
        }}
      />
    </ShopDrawerNavigator.Navigator>
  );
};

const AuthStackNavigator = createStackNavigator();

/**
 * The navigator for the user authentication screens
 */

export const AuthNavigator = () => {
  return (
    <AuthStackNavigator.Navigator screenOptions={defaultNavOptions}>
      <AuthStackNavigator.Screen
        name="Auth"
        component={AuthScreen}
        options={authScreenOptions}
      />
      <AuthStackNavigator.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={forgotPasswordScreenOptions}
      />
    </AuthStackNavigator.Navigator>
  );
};

