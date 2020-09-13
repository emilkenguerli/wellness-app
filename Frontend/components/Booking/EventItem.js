import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

//import CartItem from './CartItem';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';

const EventItem = props => {
    const [showDetails, setShowDetails] = useState(false);

    return (
        <Card style={styles.orderItem}>
        <View style={styles.summary}>
            <Text style={styles.totalAmount}>{props.item.title}</Text>
            <Text style={styles.totalAmount}>{props.item.date}</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Button
                color={Colors.accent}
                title={showDetails ? 'Hide Details' : 'Show Details'}
                onPress={() => {
                setShowDetails(prevState => !prevState);
                }}
            />
        </View>
        {showDetails && (
            <View style={styles.detailItems}>
            {
                <View style={styles.cartItem}>
                    <View style={styles.itemData}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'open-sans-bold'}}>{"Description: "} </Text>
                            <Text>{props.item.description}</Text>
                        </View>                        
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'open-sans-bold'}}>{"Venue: "} </Text>
                            <Text>{props.item.venue}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'open-sans-bold'}}>{"Duration: "} </Text>
                            <Text>{props.item.duration}</Text>
                        </View>
                    </View>
                </View>
            }
            </View>
        )}      
      
      
        </Card>
    );
};

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center'
  },
  itemData: {
    //flexDirection: 'row',
    alignItems: 'flex-start',
    width: '80%'
  },
  summary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15
  },
  totalAmount: {
    fontFamily: 'open-sans-bold',
    fontSize: 16
  },
  date: {
    fontSize: 16,
    fontFamily: 'open-sans',
    color: '#888'
  },
  detailItems: {
    width: '100%'
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 15
  },
  cartItem: {
    padding: 10,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20
  },
});

export default EventItem;
