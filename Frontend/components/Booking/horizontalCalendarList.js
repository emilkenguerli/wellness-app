import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableHighlight } from 'react-native';
import { AsyncStorage } from 'react-native';
import {CalendarList} from 'react-native-calendars';
import { FlatList } from 'react-native-gesture-handler';

const HorizontalCalendarList = (props) => {

  const [selectedDate, setSelectedDate] = React.useState('2020-08-16');
  const [markedDates, setMarkedDates] = React.useState({});
  const [times, setTimes] = React.useState([]);

  const getDates = async () => {
    try{
      // const userData = await AsyncStorage.getItem('userData');
      // const transformedData = JSON.parse(userData);
      // const { token, userId, expiryDate } = transformedData;

      // const response = await fetch(
      //   'http://192.168.50.136:9000/users', {
      //     headers:new Headers({
      //       Authorization:"Bearer "+ token
      //     })
      // });
      const response = await fetch(
        'http://192.168.50.136:9000/bookings/' + props.service
      );

      const resData = await response.json();
      //console.log(resData.times);
      const markedDate = Object.assign({});
      markedDate[resData.date] = {
        selected: true,
        selectedColor: '#DFA460'
      };
      setMarkedDates(markedDate);
      setTimes(resData.times);
      return;

    }catch(error){
      throw error;
    }
  };

  const setNewDaySelected = (date) => {
    getDates();
    const markedDate = Object.assign({});
    markedDate[date] = {
      selected: true,
      selectedColor: '#DFA460'
    };
    setSelectedDate(date);
    setMarkedDates(markedDate);
  };

  return (
    <View style={{flex:1}}>
      <CalendarList
        testID={'horizontalList'}
        markedDates={markedDates}
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
          keyExtractor={item => item}
          data={times}
          renderItem={itemData => (
            <TouchableHighlight 
              activeOpacity={0.6}
              underlayColor="#DDDDDD" 
              style={styles.listItem} 
              onPress={() => {}}>
                <Text style={styles.text}>{itemData.item}</Text>
            </TouchableHighlight>
          )}
          contentContainerStyle={styles.list}
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
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: 400,
    maxWidth: '90%'
  },
  listContainer: {
    flex: 1,
    width: '60%',
    alignSelf: 'center'
  },
  list: {
    flexGrow: 1,
    // alignItems: 'center',
    justifyContent: 'flex-end',
  },
  listItem: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
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
  }
});

export default HorizontalCalendarList;