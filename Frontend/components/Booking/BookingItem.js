import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import Colors from '../../constants/Colors';
import Card from '../UI/Card';
import * as bookingsActions from '../../store/actions/bookings';

/**
 * Reusable Booking item custom component, represents each booking displayed in the Bookings Screen on the 
 * bookings list
 * @param {*} props 
 */

const BookingItem = props => {
    const [showDetails, setShowDetails] = useState(false);
    const dispatch = useDispatch();

    const cancelHandler = () => {
      props.navigation.navigate('Cancel', {
        id: props.item.bookingID
      });
    }

    return (
        <Card style={styles.orderItem}>
        <View style={styles.summary}>
            <Text style={styles.totalAmount}>{moment(props.item.start).format('YYYY-MM-DD')}</Text>
            <Text style={styles.totalAmount}>{moment(props.item.start).subtract(2, 'hours').format('HH:mm')}</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Button
                color={Colors.primary}
                title={showDetails ? 'Hide Details' : 'Show Details'}
                onPress={() => {
                setShowDetails(prevState => !prevState);
                }}
            />
            <Button
                color={Colors.accent}
                title="Cancel Booking"
                onPress={cancelHandler}
            />
        </View>
        {showDetails && (
            <View style={styles.detailItems}>
            {
                <View style={styles.cartItem}>
                    <View style={styles.itemData}>
                      <View style={{flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'open-sans-bold'}}>{"Team: " } </Text>
                            <Text>{props.item.team}</Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'open-sans-bold'}}>{"Service: " } </Text>
                            <Text>{props.item.service}</Text>
                      </View>
                      <View style={{flexDirection: 'row'}}>
                            <Text style={{fontFamily: 'open-sans-bold'}}>{"Note: " } </Text>
                            <Text>{props.item.note}</Text>
                      </View>
                    </View>
                </View>
            }
            </View>
        )}      
      
      
        </Card>
    );
};

/**
 * The styles used for the Bookings item custom component
 */

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center'
  },
  itemData: {
    alignItems: 'flex-start'
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

export default BookingItem;
