import React, { useState, useEffect, useReducer, useCallback } from 'react';
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Button,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Text
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {

  if (action.type === FORM_INPUT_UPDATE) {

    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const AuthScreen = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSignup, setIsSignup] = useState(false);
  //const [signupToLogin, setSignupToLogin] = useState(false);
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      password2: '',
      name: '',
      studentNumber: '',
      phoneNumber: ''
    },
    inputValidities: {
      email: false,
      password: false,
      password2: false,
      name: false,
      studentNumber: false,
      phoneNumber: true
    },
    formIsValid: false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const authHandler = async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password,
        formState.inputValues.name,
        formState.inputValues.studentNumber,
        formState.inputValues.phoneNumber,
        formState.formIsValid
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      setIsLoading(false);
      setIsSignup(false);
      //setSignupToLogin(true);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 10;

  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.screen}
    >
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            {!isSignup &&(
              <View>
                <Input
                  id="password"
                  label="Password"
                  keyboardType="default"
                  secureTextEntry
                  required
                  password
                  minLength={8}
                  autoCapitalize="none"
                  errorText="Password needs to be at least 8 char."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
                <TouchableOpacity style={{marginVertical: 15}} onPress={() => {props.navigation.navigate('ForgotPassword')}}>
                  <Text style={{ fontSize: 13, fontWeight: '700'}}>{"Forgot Password?"}</Text>
                </TouchableOpacity>
              </View>
            )}           
            {isSignup &&(
              <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              password
              minLength={8}
              autoCapitalize="none"
              errorText="Password needs to be at least 8 char."
              onInputChange={inputChangeHandler}
              initialValue=""
              />
            )}
            {isSignup &&(
              <View>
                <Input
                id="password2"
                label="Retype Password"
                keyboardType="default"
                secureTextEntry
                required
                password2
                minLength={8}
                autoCapitalize="none"
                errorText="Passwords do not match."
                onInputChange={inputChangeHandler}
                initialValue=""
                />
                <Input
                id="name"
                label="Name"
                keyboardType="default"
                required
                autoCapitalize="none"
                errorText="Please enter a valid name."
                onInputChange={inputChangeHandler}
                initialValue=""
                />
                <Input
                id="studentNumber"
                label="StudentNumber"
                keyboardType="default"
                required
                minLength={8}
                autoCapitalize="none"                
                errorText="Please enter a valid studentNumber."
                onInputChange={inputChangeHandler}
                initialValue=""
                />
                <Input
                id="phoneNumber"
                label="Phone Number (optional)"
                keyboardType="number-pad"
                autoCapitalize="none"
                phone
                errorText="Please enter a valid phone number."
                onInputChange={inputChangeHandler}
                initialValue=""
                initiallyValid={true}
                />
              </View>
            )}
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignup ? 'Sign Up' : 'Login'}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={Colors.accent}
                onPress={() => {
                  setIsSignup(prevState => !prevState)
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: "85%",
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default AuthScreen;
