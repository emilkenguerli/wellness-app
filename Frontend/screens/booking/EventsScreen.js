import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    FlatList,
    Text,
    Platform,
    ActivityIndicator,
    StyleSheet,
    Button
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { LinearGradient } from 'expo-linear-gradient';

import EventItem from '../../components/Booking/EventItem';
import Colors from '../../constants/Colors';
import * as eventActions from '../../store/actions/events';

/**
 * This renders all the components togther on the Events Screen. Each event on the screen is 
 * represented using the EventItem component
 * @param {*} props 
 */

const EventsScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const events = useSelector(state => state.events.availableEvents);
    const dispatch = useDispatch();

    /**
     * This React hook deals with refreshing and dispatching actions to the redux store in order to 
     * load events from the database
     */

    const loadEvents = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(eventActions.fetchEvents());
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsLoading, setError]);

    /**
     * This React hook loads the events when the screen goes out of focus
     */

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadEvents);

        return () => {
            unsubscribe();
        };
    }, [loadEvents]);

    /**
     * This React hook monitors whether the events have loaded or not yet
     */

    useEffect(() => {
        setIsLoading(true);
        loadEvents().then(() => {
            setIsLoading(false);
        });
    }, [dispatch, loadEvents]);

    // If an error occurs while loading the events from the database, an error will be thrown 
    // and Try again will be rendered on the screen

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occurred!</Text>
                <Button
                    title="Try again"
                    onPress={loadEvents}
                    color={Colors.primary}
                />
            </View>
        );
    }

    // This checks if the screen is still loading events from the database and displays a 
    // loading circle while the user waits for the events to render on the screen

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    // If no events were found in the database the text outlined below will be rendered on 
    // the screen

    if (!isLoading && events.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No events currently scheduled</Text>
            </View>
        );
    }

    return (
        <LinearGradient colors={['#e6e6fa', '#e6e6fa']} style={styles.screen} >
            <FlatList
                onRefresh={loadEvents}
                refreshing={isRefreshing}
                data={events}
                keyExtractor={item => item._id}
                renderItem={itemData => (
                    <EventItem
                        item={itemData.item}
                    />
                )}
            />
        </LinearGradient>
    );

};

/**
 * This renders the menu hamburger icon on the top left of the screen as well as setting the header
 * title of the screen to 'Events'
 * @param {*} navData : navigation data from the BookingNavigator
 */

export const screenOptions = navData => {
    return {
        headerTitle: 'Events',
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
 * The styles for the Events Screen component
 */

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }

});

export default EventsScreen;