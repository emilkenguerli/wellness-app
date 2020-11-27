import React, { useEffect, useState, useReducer, useCallback } from 'react';
import {
  View,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Button,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import Colors from '../../constants/Colors';
import * as authActions from '../../store/actions/auth';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

/**
 * Sets the overall form of all the input objects on the screen and whether they are valid or not
 * @param {*} state : this is the state of the current input object, in terms of it's value and 
 *                    whether it is valid or not
 * @param {*} action : only the action of the input being updated is recognised
 */

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

/**
 * Renders the send verficiation code components first then in sequence as the user progresses
 * through the process, it renders the verify code and reset password components.
 * @param {*} props 
 */

const ForgotPasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
      password2: '',
      code: ''
    },
    inputValidities: {
      email: false,
      password: false,
      password2: false,
      code: false
    },
    formIsValid: false
  });

  /**
   * This React hook throws an error if the actions dispatched to the redux store are not
   * successful.
   */

  useEffect(() => {
    if (error) {
      Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  /**
   * Renders send verification/verify code/ reset password components in sequence
   * Dispatches the sendVerificationCode and verifyCode actions to the redux store when their 
   * respective buttons are pressed by the user.
   */

  const authHandler = async () => {
    let action;
    if (!isSent) {
      action = authActions.sendVerificationCode(
        formState.inputValues.email,
        formState.inputValidities.email
      );
    } else {
      action = authActions.verifyCode(
        formState.inputValues.code,
        formState.inputValidities.code
      )
    }

    setError(null);
    setIsLoading(true);
    try {
      await dispatch(action);
      if (formState.inputValues.code.length !== 0) {
        console.log(formState.inputValues.code);
        setIsVerified(true);
        setIsSent(false);
      } else {
        setIsSent(true);
      }
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  /**
   * This handles the reseting of the password and dispatches the resetPassword to the
   * redux store so that it can updates the password of the user in the database
   */

  const passwordHandler = async () => {
    try {
      await dispatch(authActions.resetPassword(
        formState.inputValues.password,
        formState.inputValues.code,
        formState.inputValidities.password,
        formState.inputValidities.password2
      ));
      Alert.alert('Password Reset Successfully', 'Your new password is ready to use', [{ text: 'Okay' }]);
      props.navigation.navigate('Auth');
    } catch (err) {
      setError(err.message);
    }
  }

  /**
   * Upon any of the input values of any of the text fields changing, the form of the input
   * objects is updated
   */

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

  const keyboardVerticalOffset = Platform.OS === 'ios' ? 40 : 0;

  return (
    <KeyboardAvoidingView
      behavior='padding'
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={styles.screen}
    >
      <LinearGradient colors={['#e6e6fa', '#e6e6fa']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            {(!isSent && !isVerified) && (
              <View>
                <Text style={styles.noteText}>
                  {"Please provide your account email address to request a password reset code. You will receive the code if your email address is valid."}
                </Text>
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
              </View>
            )}
            {isSent && (
              <View>
                <Text style={styles.noteText}>
                  {"Input the code sent to your email address"}
                </Text>
                <Input
                  id="code"
                  placeholder="Input Code"
                  keyboardType="number-pad"
                  code
                  minLength={6}
                  maxLength={6}
                  autoCapitalize="none"
                  errorText="Enter a valid code."
                  onInputChange={inputChangeHandler}
                  initialValue=""
                />
              </View>
            )}
            {isVerified && (
              <View>
                <Text style={styles.noteText}>
                  {"Successfully verified. Please input a new password"}
                </Text>
                <Input
                  id="password"
                  placeholder="Password"
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
                <Input
                  id="password2"
                  placeholder="Retype Password"
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
                <View style={styles.buttonContainer}>
                  {isLoading ? (
                    <ActivityIndicator size="small" color={Colors.primary} />
                  ) : (
                      <Button
                        title={"Reset Password"}
                        color={Colors.primary}
                        onPress={passwordHandler}
                      />
                    )}
                </View>
              </View>
            )}
            {!isVerified && (
              <View style={styles.buttonContainer}>
                {isLoading ? (
                  <ActivityIndicator size="small" color={Colors.primary} />
                ) : (
                    <Button
                      title={`${isSent ? 'Submit Code' : 'Request Reset Code'}`}
                      color={Colors.primary}
                      onPress={authHandler}
                    />
                  )}
              </View>
            )}
          </ScrollView>
        </Card>
      </LinearGradient>

    </KeyboardAvoidingView>

  );

};

/**
 * This sets the header title of the screen to 'Forgot Password'
 */

export const screenOptions = {
  headerTitle: 'Forgot Password',
};

/**
 * The styles for the Forgot Password Screen component
 */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  noteText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 15,
    marginVertical: 15,
    fontFamily: 'open-sans-bold',
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

export default ForgotPasswordScreen;