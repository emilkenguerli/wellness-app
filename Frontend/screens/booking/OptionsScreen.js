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
  Button
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import DropDownPicker from 'react-native-dropdown-picker';
import { NavigationActions, StackActions } from '@react-navigation/native';

import TitleText from '../../components/UI/TitleText';
import Input from '../../components/UI/Input';
import Card from '../../components/UI/Card';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '../../constants/Colors';
import * as bookingsActions from '../../store/actions/bookings';

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

const OptionsScreen = (props) => {
  const [chosenStaff, setChosenStaff] = useState('Anyone');
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

  const saveBookingHandler = () => {
    const newBooking = {
      bookingID: props.route.params.bookingID,
      staffId: chosenStaff,
      team: props.route.params.team,
      service: props.route.params.service,
      start: props.route.params.start,  // Will change
      end: props.route.params.end, // Will change
      note: formState.inputValues.note
    };
    //console.log(newBooking.start);
    dispatch(bookingsActions.addToBookings(newBooking));
    const resetAction = StackActions.replace('Calendar');
  
    props.navigation.dispatch(resetAction); 
    props.navigation.navigate('Bookings');
  };

  return (  
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.screen} >
        <View style={styles.staffContainer}>
          {<TitleText style={styles.title}>Select Staff</TitleText>}
          <DropDownPicker
            items={props.route.params.staff}
            defaultValue={'0'}
            placeholder="Select a Service"
            containerStyle={{height: 40, width: '50%'}}
            style={{backgroundColor: '#fafafa'}}
            itemStyle={{
                justifyContent: 'flex-start'
            }}
            dropDownStyle={{backgroundColor: '#fafafa'}}
            onChangeItem={item => setChosenStaff(item.label)}
          /> 
        </View>
        <View style={styles.noteContainer}>
          {<TitleText style={styles.title}>Please let us know if you have any special requests. Thank you</TitleText>}
          <View style={styles.gradient}>
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
                title="Save Booking"
                color={Colors.accent}
                onPress={saveBookingHandler}
              />
            </View>
        </View>
      </LinearGradient> 
  );
};

export const screenOptions = navData => {
    return {
      headerTitle: 'Optional'
    };
};
  
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //alignItems: 'center',
  },
  title: {
    fontSize: 20,
    marginVertical: 10,
    fontFamily: 'open-sans-bold'
  },
  staffContainer: {
    marginVertical: 15,
    marginHorizontal: 30,
    //width: '100%',
    alignItems: 'center'
  },
  noteContainer: {
    marginVertical: 15,
    marginHorizontal: 30,
    //alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
    marginVertical: 15
  },
  gradient: {
    //flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer: {
    marginTop: 10
  }
});
  
export default OptionsScreen;