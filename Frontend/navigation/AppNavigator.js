import React from 'react';
import { useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';

import { BookingNavigator, AuthNavigator } from './BookingNavigator';

const AppNavigator = props => {
  const isAuth = useSelector(state => !!state.auth.token);
  
  return (
    <NavigationContainer>
      {isAuth && <BookingNavigator />}
      {!isAuth && <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
