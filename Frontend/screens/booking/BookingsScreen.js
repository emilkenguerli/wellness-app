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
import { LinearGradient } from 'expo-linear-gradient';

import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import BookingItem from '../../components/Booking/BookingItem';
import * as bookingsActions from '../../store/actions/bookings';
import Colors from '../../constants/Colors';

/**
 * This renders all the components togther on the Booking Screen. Each booking on the screen is 
 * represented using the BookingItem component
 * @param {*} props 
 */

const BookingsScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const userEmail = useSelector(state => state.auth.email);
    var userBookings = {};
    const bookings = Object.values(useSelector(state => state.bookings.items));
    if(bookings !== {}){  
        userBookings = bookings.filter(booking => booking.student.email === userEmail);
    }
    const dispatch = useDispatch();

    /**
     * This React hook deals with refreshing and dispatching actions to the redux store in order to 
     * load bookings from the database
     */

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

    /**
     * This React hook loads the books when the screen goes out of focus
     */

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadBookings);

        return () => {
            unsubscribe();
        };
    }, [loadBookings]);

    /**
     * This React hook monitors whether the bookings have loaded or not yet
     */

    useEffect(() => {
        setIsLoading(true);
        loadBookings().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadBookings]);
 
    // If an error occurs while loading the books from the database, an error will be thrown 
    // and Try again will be rendered on the screen

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

   // This checks if the screen is still loading bookings from the database and displays a 
   // loading circle while the user waits for the bookings to render on the screen

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // If no bookings were found in the database the text outlined below will be rendered on 
    // the screen

    if (!isLoading && userBookings.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>You don't have any bookings at the moment, go to Calendar to add one</Text>
            </View>
        );
    }


    return (
        <LinearGradient colors={['#e6e6fa', '#e6e6fa']} style={styles.screen} >
            <FlatList
                onRefresh={loadBookings}
                refreshing={isRefreshing}
                data={userBookings}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <BookingItem
                        navigation={props.navigation}
                        item={itemData.item}
                    />
                )}
            />
        </LinearGradient>
    );
};

/**
 * This renders the menu hamburger icon on the top left of the screen as well as setting the header
 * title of the screen to Your Bookings
 * @param {*} navData : navigation data from the BookingNavigator
 */

export const screenOptions = navData => {
    return {
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

/**
 * The styles for the Bookings Screen component
 */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

});

export default BookingsScreen;
