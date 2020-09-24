import React, { useEffect, useState, useReducer, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  ScrollView,
  Button,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';

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
    
      useEffect(() => {
        if (error) {
          Alert.alert('An Error Occurred!', error, [{ text: 'Okay' }]);
        }
      }, [error]);
    
      const authHandler = async () => {
        let action;
        if (!isSent) {
          action = authActions.sendVerificationCode(
            formState.inputValues.email,
            formState.inputValidities.email
          );
        }else{
            action = authActions.verifyCode(
                formState.inputValues.code,
                formState.inputValidities.code
            )
        }
       
        setError(null);
        setIsLoading(true);
        try {
          await dispatch(action);
          if(formState.inputValues.code.length !== 0){
              console.log(formState.inputValues.code);
              setIsVerified(true);
              setIsSent(false);
          }else{
              setIsSent(true);
          }
          setIsLoading(false);         
          //setSignupToLogin(true);
        } catch (err) {
          setError(err.message);
          setIsLoading(false);
        }
      };

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
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        {(!isSent && !isVerified) && (
                            <View>
                                <Text style={styles.noteText}>
                                    {"Please provide your account email address to request a password reset code. You will receive your a code to your email address if it is valid."}
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
                                        color={Colors.accent}
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
                                    color={Colors.accent}
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

export const screenOptions = {    
    headerTitle: 'Forgot Password',  
};
  
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //alignItems: 'center',
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