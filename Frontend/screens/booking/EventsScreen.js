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
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import EventItem from '../../components/Booking/EventItem';
import Colors from '../../constants/Colors';
import * as eventActions from '../../store/actions/events';

const EventsScreen = (props) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState();
    const events = useSelector(state => state.events.availableEvents);
    const dispatch = useDispatch();
    //console.log(events);
    
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

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', loadEvents);

        return () => {
        unsubscribe();
        };
    }, [loadEvents]);

    useEffect(() => {
        setIsLoading(true);
        loadEvents().then(() => {
        setIsLoading(false);
        });
    }, [dispatch, loadEvents]);

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

    if (isLoading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
        </View>
        );
    }

    if (!isLoading && events.length === 0) {
        return (
        <View style={styles.centered}>
            <Text>No events currently scheduled</Text>
        </View>
        );
    }
    
    return (
        <View style={styles.screen}>
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
        </View>
    );

};

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
  
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    //alignItems: 'center',
  },
  centered: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  }
  
});
  
export default EventsScreen;