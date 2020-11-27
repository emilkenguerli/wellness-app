import React from 'react';
import { View, Text, StyleSheet, TouchableHighlight, Button, Alert, Dimensions } from 'react-native';
import {CalendarList} from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';

import Colors from '../../constants/Colors';
import * as calendarActions from '../../store/actions/calendar';

/**
 * This is a reusable custom component that displays the calendar on the Calendar Screen as well as 
 * dynamically rendering a list of times under the calendar when a date is selected
 * @param {*} props 
 */

const HorizontalCalendarList = (props) => {
  const [selectedDate, setSelectedDate] = React.useState(Date());
  const [selectedTime, setSelectedTime] = React.useState('');
  const bookingID = Object.values(useSelector(state => state.bookings.items)).length;
  const times = useSelector(state => state.calendar.availableTimes);
  const dispatch = useDispatch();

  /**
   * This method is called whenever a new date is selected by a user on the calendar component, it resets 
   * the time that was selected on the previous date, then it rerenders the time list based on the service 
   * and date selected by the user.
   * @param {*} date : the date selected by the user
   */

  const setNewDaySelected = (date) => {
    setSelectedTime('');
    setSelectedDate(date);   
    dispatch(calendarActions.setTimes(props.times, props.service, date));
  };

  /**
   * This method is called whenever the user presses the confirm booking button. It confirms that all the 
   * required filters have been selected and then navigates to the Options Screen if no errors are thrown.
   */

  const confirmBookingHandler = () => {
    if(selectedTime === '' || times.length === 0){
      Alert.alert('An Error Occurred!', 'Need to select a time!', [{ text: 'Okay' }]);
    }
    else{
      var start = new Date(selectedDate);
      var hours = parseInt(selectedTime.slice(0,2));
      var minutes = parseInt(selectedTime.slice(3));

      start.setHours(start.getHours()+hours,minutes,0);

      var end = new Date(start);
      var total = minutes + props.duration;
      var hours2 = parseInt(total/60);
      if(hours2 > 0){
        var minutes2 = total % 60;
        end.setHours(end.getHours()+hours2,minutes2,0);
      }
      else{
        end.setHours(end.getHours()+0,props.duration,0);
      }     

      props.navigation.navigate('Options', {
        team: props.team,
        service: props.service,
        bookingID: bookingID,
        start: start,
        end: end,
        staff: Object.assign(props.staff.map((o, index) => ({label: o, value: index.toString()})))
      });
    };
  };

  return (
    <View style={{flex:1}}>
      <CalendarList
        testID={'horizontalList'}
        style={{height: Dimensions.get('window').height * 0.5}}
        markedDates={props.currentMarkedDates}
        current={selectedDate}
        pastScrollRange={4}
        futureScrollRange={4}
        horizontal
        pagingEnabled
        onDayPress={(day) => {
          setNewDaySelected(day.dateString);               
        }}
        markingType={'custom'}
      />
      <View style={styles.listContainer}>
        <FlatList
          keyExtractor={item => item.key}
          data={times}
          renderItem={itemData => (
            <TouchableHighlight 
              activeOpacity={0.6}
              underlayColor="#DDDDDD" 
              style={styles.listItem} 
              extraData={selectedTime}
              onPress={() => {setSelectedTime(itemData.item.name)}}>
                <View style={styles.contentChecked}>
                  <Text style={styles.text}>{itemData.item.name}</Text>
                  {selectedTime === itemData.item.name && <Ionicons 
                    name={Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'} 
                    size={18} 
                    color="#900"
                    style={styles.iconChecked}
                    />}
                </View>
            </TouchableHighlight>
          )}
          contentContainerStyle={styles.list}
        />
      </View>
      <View style={styles.actions}>
        <Button
            color={Colors.primary}
            title="Confirm Booking"
            onPress={confirmBookingHandler}
        /> 
      </View>            
    </View>
  );
};

/**
 * The styles used for the Horizontal Calendar custom component
 */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 10,
    alignItems: 'center'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: 400,
    maxWidth: '90%'
  },
  listContainer: {
    width: '60%',
    height: '20%',
    alignSelf: 'center'
  },
  list: {
    flexGrow: 1,
    justifyContent: 'flex-start' 
  },
  listItem: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 5,
    marginVertical: 5,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    
  },
  text: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  },
  contentChecked: {
		justifyContent: 'space-between',
		alignItems: 'center',
		height: '100%',
		flexDirection: 'row'
  },
  iconChecked: {
		marginRight: 20
  },
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  }
});

export default HorizontalCalendarList;