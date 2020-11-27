import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * This is a reusable custom component, it can be used to represent items on a rounded card shape
 * @param {*} props 
 */

const Card = props => {
  return <View style={{...styles.card, ...props.style}}>{props.children}</View>;
};

/**
 * The styles used for the card component
 */

const styles = StyleSheet.create({
  card: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    backgroundColor: 'white'
  }
});

export default Card;
