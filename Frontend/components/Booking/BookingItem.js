import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

//import CartItem from './CartItem';
import Colors from '../../constants/Colors';
import Card from '../UI/Card';
import * as bookingsActions from '../../store/actions/bookings';

const BookingItem = props => {
    const [showDetails, setShowDetails] = useState(false);
    const dispatch = useDispatch();

    return (
        <Card style={styles.orderItem}>
        <View style={styles.summary}>
            <Text style={styles.totalAmount}>{moment(props.item.start).format('YYYY-MM-DD')}</Text>
            <Text style={styles.totalAmount}>{moment(props.item.start).format('h:mm')}</Text>
        </View>
        <View style={styles.buttonContainer}>
            <Button
                color={Colors.accent}
                title={showDetails ? 'Hide Details' : 'Show Details'}
                onPress={() => {
                setShowDetails(prevState => !prevState);
                }}
            />
            <Button
                color={Colors.primary}
                title="Cancel Booking"
                onPress={() => {dispatch(bookingsActions.removeFromBookings(props.item.bookingID))}}
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

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: 'center'
  },
  itemData: {
    //flexDirection: 'row',
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
