import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight, Button, Alert, Dimensions } from 'react-native';
import { AsyncStorage } from 'react-native';
import {CalendarList} from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import moment, { min } from 'moment';

import Colors from '../../constants/Colors';

const HorizontalCalendarList = (props) => {

  const [selectedDate, setSelectedDate] = React.useState(Date());
  const [times, setTimes] = React.useState([]);
  const [selectedTime, setSelectedTime] = React.useState('');
  const bookingID = Object.values(useSelector(state => state.bookings.items)).length;
  const bookings = useSelector(state => state.bookings.items);

  const setNewDaySelected = (date) => {
    setSelectedTime('');
    const markedDate = Object.assign({});
    markedDate[date] = {
      selected: true,
      selectedColor: '#DFA460'
    };
    setSelectedDate(date);
    //let objTimes = {};
    let timelist = props.times;

    // for(let i = 0;i < props.currentBookingData.length;i++){
    //   if(props.currentBookingData[i][0] === date){
    //     timelist = props.currentBookingData[i][1];
    //     break;
    //   } 
    // }
    // objTimes = Object.assign(timelist.map((o, index) => ({name: o, key: index})));
    //setTimes(objTimes);
    //let totalTimelist = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    //setTimes(Object.assign(totalTimelist.map((o, index) => ({name: o, key: index}))));
    // for(let i = 0;i < 600/props.duration;i++){
    //   timelist[i] = 
    // }

    for(let i = 0;i < bookings.length;i++){
      if(moment(bookings[i].start).format('YYYY-MM-DD') === date && bookings[i].service === props.service){
        let start = parseInt(moment(bookings[i].start).subtract(2, 'hours').format('HH')) * 60 + parseInt(moment(bookings[i].start).format('mm'));
        let end = parseInt(moment(bookings[i].end).subtract(2, 'hours').format('HH')) * 60 + parseInt(moment(bookings[i].end).format('mm'));
        let count = 0;
        let temp = [...timelist];
        for(let j = 0;j < timelist.length;j++){
          let now = parseInt(temp[count].slice(0,2)) * 60 + parseInt(temp[count].slice(3));
          if(start <= now && now < end){
            temp.splice(count,1);
            continue;
          }
          count ++;
        };
        timelist = [...temp];
      }    
    };

    setTimes(Object.assign(timelist.map((o, index) => ({name: o, key: index}))));

  };

  const confirmBookingHandler = () => {
    if(selectedTime === ''){
      Alert.alert('An Error Occurred!', 'Need to select a time!', [{ text: 'Okay' }]);
    }
    else{
      //setBookingID(Object.values(useSelector(state => state.bookings.items)).length);
      var start = new Date(selectedDate);
      var hours = parseInt(selectedTime.slice(0,2));
      var minutes = parseInt(selectedTime.slice(3));
      //console.log(minutes);
      start.setHours(start.getHours()+hours,minutes,0);
      //console.log(start);
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
      //console.log(end);

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
    // alignItems: 'center',
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