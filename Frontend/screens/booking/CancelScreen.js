import React, { useState, useReducer, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Button
} from 'react-native';
import { useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import { NavigationActions, StackActions } from '@react-navigation/native';

import TitleText from '../../components/UI/TitleText';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import * as bookingsActions from '../../store/actions/bookings';

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


const CancelScreen = (props) => {
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      note: ''
    },
    inputValidities: {
      note: false
    },
    formIsValid: false
  });

  /**
   * Upon the input of the note changing, the form of the input objects is updated
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

  const cancelBookingHandler = () => {
    dispatch(bookingsActions.removeFromBookings(props.route.params.id))
    props.navigation.navigate('Bookings');
  };

  return (
    <LinearGradient colors={['#e6e6fa', '#e6e6fa']} style={styles.screen} >
      <View style={styles.noteContainer}>      
        <View style={styles.gradient}>
        {<TitleText style={styles.title}>Reason for cancelation</TitleText>}
          <Card style={styles.authContainer}>
            <ScrollView>
              <Input
                id="note"
                label="Note"
                keyboardType="default"
                maxLength={100}
                autoCapitalize="none"
                errorText="Text has reached the limit"
                onInputChange={inputChangeHandler}
                initialValue=""
              />
            </ScrollView>
          </Card>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Confirm Cancelation"
            color={Colors.primary}
            onPress={cancelBookingHandler}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

/**
 * This sets the header title of the screen to 'Cancel Confirmation'
 */

export const screenOptions = navData => {
  return {
    headerTitle: 'Cancel Confirmation'
  };
};

/**
 * The styles for the Cancel Screen component
 */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'open-sans-bold',
  },
  noteContainer: {
    marginVertical: 15,
    marginHorizontal: 30
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
    marginVertical: 15
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10
  }
});

export default CancelScreen;