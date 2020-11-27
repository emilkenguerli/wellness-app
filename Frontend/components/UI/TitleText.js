import React from 'react';
import { Text, StyleSheet } from 'react-native';

/**
 * This is a reusable custom component that is used to represent a title 
 * @param {*} props 
 */

const TitleText = props => (
  <Text style={{ ...styles.title, ...props.style }}>{props.children}</Text>
);

/**
 * Styles for the title text component
 */

const styles = StyleSheet.create({
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18
  }
});

export default TitleText;