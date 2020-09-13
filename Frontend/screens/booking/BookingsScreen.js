import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import BookingItem from '../../components/Booking/BookingItem';
import * as bookingsActions from '../../store/actions/bookings';
import Colors from '../../constants/Colors';

const BookingsScreen = props => {
  //const bookings = Object.values(useSelector(state => state.bookings.items));
  //console.log(bookings);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState();
  const bookings = useSelector(state => state.bookings.items);
  const dispatch = useDispatch();
  //console.log(bookings);
    
    const loadBookings = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
          await dispatch(bookingsActions.fetchBookings());
        } catch (err) {
          setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadBookings);

        return () => {
        unsubscribe();
        };
    }, [loadBookings]);

    useEffect(() => {
        setIsLoading(true);
        loadBookings().then(() => {
        setIsLoading(false);
        });
    }, [dispatch, loadBookings]);

    if (error) {
        return (
        <View style={styles.centered}>
            <Text>An error occurred!</Text>
            <Button
            title="Try again"
            onPress={loadBookings}
            color={Colors.primary}
            />
        </View>
        );
    }

    if (isLoading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
        );
    }

    if (!isLoading && bookings.length === 0) {
        return (
        <View style={styles.centered}>
            <Text>You don't have any bookings at the moment, go to Calendar to add one</Text>
        </View>
        );
    }


  return (
    <View style={styles.screen}>
        <FlatList
            onRefresh={loadBookings}
            refreshing={isRefreshing}
            data={bookings}
            keyExtractor={item => item._id}
            renderItem={itemData => (
                <BookingItem
                    item={itemData.item}
                />
            )}
        />
    </View>
  );
};

export const screenOptions = navData => {
    return{
        headerTitle: 'Your Bookings',
        headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
            <Item
                title="Menu"
                iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
                onPress={() => {
                navData.navigation.toggleDrawer();
                }}
            />
            </HeaderButtons>
        )
    };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    margin: 20
  },
  
});

export default BookingsScreen;
