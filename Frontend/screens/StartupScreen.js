import React, { useEffect } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} from 'react-native';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

/**
 * This screen only consists of a loading circle that tries to login automatically if the user hasn't
 * logged out yet but closed the app and now wants to enter it again
 * @param {*} props 
 */

const StartupScreen = props => {
  const dispatch = useDispatch();

  /**
   * Dispatches multiple user authentication actions to the redux store to determine whether the token
   * has expired and if the user qualifies for automatic login
   */

  useEffect(() => {
    const tryLogin = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        dispatch(authActions.setDidTryAL());
        return;
      }
      const transformedData = JSON.parse(userData);
      const { token, userId, expiryDate } = transformedData;
      const expirationDate = new Date(expiryDate);

      if (expirationDate <= new Date() || !token || !userId) {
        dispatch(authActions.setDidTryAL());
        return;
      }

      const expirationTime = expirationDate.getTime() - new Date().getTime();

      dispatch(authActions.authenticate(userId, token, expirationTime));
    };

    tryLogin();
  }, [dispatch]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

/**
 * The styles of the loading circle component
 */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default StartupScreen;
