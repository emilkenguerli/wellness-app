import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { BookingNavigator, AuthNavigator } from './BookingNavigator';
import StartupScreen from '../screens/StartupScreen';

/**
 * This is a navigation component that handles the user authentication screens if the
 * token given to the user on login has not yet expired and the user is attempting to
 * reenter the app without having logged out, they will be automatically signed in into 
 * the home screen. When they log in it navigates them to the home screen
 */

const AppNavigator = () => {
  const isAuth = useSelector(state => !!state.auth.token);
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);
  
  return (
    <NavigationContainer>
      {isAuth && <BookingNavigator />}
      {!isAuth && didTryAutoLogin && <AuthNavigator />}
      {!isAuth && !didTryAutoLogin && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
