import React, { useReducer, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as authActions from '../../store/actions/auth';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR = 'INPUT_BLUR';

/**
 * Handles the state of the input object based on the action it receives
 * @param {*} state : this is the state of the current input object, in terms of it's value and 
 *                    whether it is valid or not according to the conditions outlined below
 * @param {*} action : can be either be an input change or input blur on keyboard release action
 */

const inputReducer = (state, action) => {
  switch (action.type) {
    case INPUT_CHANGE:
      return {
        ...state,
        value: action.value,
        isValid: action.isValid
      };
    case INPUT_BLUR:
      return {
        ...state,
        touched: true
      };
    default:
      return state;
  }
};

/**
 * Component that renders a text input box as well as handles whether the text input into it is
 * valid or not based on certain conditions.
 * @param {*} props 
 */

const Input = props => {
  const [inputState, dispatchInput] = useReducer(inputReducer, {
    value: props.initialValue ? props.initialValue : '',
    isValid: props.initiallyValid,
    touched: false
  });
  const password = useSelector(state => state.auth.password);
  const { onInputChange, id } = props;

  const dispatch = useDispatch();

  /**
   * React hook that is called at the end of a render cycle if on of it's dependencies change, 
   * i.e. if the state of the input changes, the actual input, or the id of the input object
   */

  useEffect(() => {
    if (inputState.touched) {
      onInputChange(id, inputState.value, inputState.isValid);
    }
  }, [inputState, onInputChange, id]);

  /**
   * Tests the input text against several conditions to determine whether the text is valid or not,
   * it then reflects the result as a boolean for the isValid attribute of the input object
   * @param {*} text : the text that is input by the user
   */

  const textChangeHandler = (text) => {
    const emailRegex = /^[a-z0-9](\.?[a-z0-9]){7,}@((myuct)|([[a-z]{2,}.uct)|(uct))\.ac.za$/i;
    const phoneRegex = /^[0-9]{10,}$/;
    const codeRegex = /^[0-9]{6,}$/;
    let isValid = true;
    if(props.phone && ((text.length !== 0 && text.length !== 10) || !phoneRegex.test(text.toLowerCase()))){     
      isValid = false;
    }
    if(props.code && (text.trim().length === 0 || !codeRegex.test(text.toLowerCase()))){
      isValid = false;
    }
    if(props.password){
      dispatch(authActions.setPassword(text));
    }
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min != null && +text < props.min) {
      isValid = false;
    }
    if (props.max != null && +text > props.max) {
      isValid = false;
    }
    if (props.minLength != null && text.length < props.minLength) {
      isValid = false;
    }
    if (props.maxLength != null && text.length > props.maxLength) {
      isValid = false;
    }
    if(props.password2 && (text !== password)){
      isValid = false;
    }
    dispatchInput({ type: INPUT_CHANGE, value: text, isValid: isValid });
  };

  /**
   * If the user presses of the screen the action of the object changes to INPUT_BLUR
   * and this is reflected in the state of the input object
   */

  const lostFocusHandler = () => {
    dispatchInput({ type: INPUT_BLUR });
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        onBlur={lostFocusHandler}
      />
      {!inputState.isValid && inputState.touched && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{props.errorText}</Text>
        </View>
      )}
    </View>
  );
};

/**
 * The styles used for the text box component
 */

const styles = StyleSheet.create({
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    fontFamily: 'open-sans',
    color: 'red',
    fontSize: 13
  }
});

export default Input;
