import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CalendarList } from 'react-native-calendars';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';

import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import HorizontalCalendarList from '../../components/Booking/horizontalCalendarList';
import { ScrollView } from 'react-native-gesture-handler';
import * as bookingsActions from '../../store/actions/bookings';

const CalendarScreen = (props) => {
  const [pickedItem, setPickedItem] = useState('medical');
  const [pickedMedicalService, setPickedMedicalService] = useState(null);
  const [pickedPsychologicalService, setPickedPsychologicalService] = useState(null);
  const [pickedService, setPickedService] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [bookingData, setBookingData] = useState([]);
  const [staff, setStaff] = useState([]);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const bookings = useSelector(state => state.bookings.items);
  const dispatch = useDispatch();

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

  useEffect(() => {
    //const getDates = async () => {
      //console.log('test');
      //try{
        // const response = await fetch(
        //   'http://192.168.50.136:9000/bookings/'
        // );
        // var d = new Date('2020-09-26');
        // d.setHours(d.getHours()+7,30,0);
        // console.log(moment(d).format('h:mm'));
        // console.log(moment(d).format('YYYY-MM-DD'));
        //const resData = await response.json();
        //console.log("hello");
        //let dates = [];
          
        // for(let i = 0; i < resData.dates.length;i++){
        //   dates[i] = resData.dates[i][0];
        // };

        //setStaff(resData.staff);
        setStaff(['Anyone', 'Musa', 'Emil', 'Bonnie']);
        //console.log(resData.dates);
        //setBookingData(resData.dates);
        //setMarkedDates(Object.assign(...dates.map(o => ({[o]: {selected: true,selectedColor: '#DFA460'}}))));
        let alldates = [];
        let count = 0;
        //console.log(bookings);
        for(let i = 0;i < 120;i++){
          if(moment().add(i, 'days').format('dddd') === "Saturday" || 
            moment().add(i, 'days').format('dddd') === "Sunday"){
            continue;
          }
          alldates[count] = moment().add(i, 'days').format('YYYY-MM-DD');
          count ++;
        };
        //console.log(alldates);
        setMarkedDates(Object.assign(...alldates.map(o => ({[o]: {selected: true,selectedColor: '#DFA460'}}))));
         
        if(specificService === 'omf' || specificService === 'tnoa' || specificService === 'tna' || 
          specificService === 'pn'){
          setDuration(30);
        }
        else if(specificService === 'cov19'){
          setDuration(20);
        }
        else if(specificService === 'sws'){
          setDuration(40);
        }
        else{
          setDuration(60);
        }
    //   }catch(error){
    //     throw error;
    //   }
    // };

    //getDates();
  }, [pickedMedicalService, pickedPsychologicalService, pickedItem])

  const serviceHandler = (value, service) => {
    if(pickedItem === 'medical' ){
      setPickedMedicalService(value, service);
    }else{
      //console.log("yo");
      setPickedPsychologicalService(value, service);
    }
    
    setPickedService(service);
  };

  const medicalServices = (
    <DropDownPicker
        items={[
            {label: 'Online - Medical Officer | 30 min', value: 'omf',
            },
            {label: 'Triage Nurse - Online Advice | 30 min', value: 'tnoa', 
            },
            {label: 'Telephonic Nurse Advice | 30 min', value: 'tna', 
            },
            {label: 'COVID-19 Student Hotline Queries | 20 min', value: 'cov19',
            },
            {label: 'Online Psychiatrist Session | 1 hour', value: 'ops',
            }
        ]}
        defaultValue={pickedMedicalService}
        placeholder="Select a Service"
        containerStyle={{height: 40}}
        style={{backgroundColor: '#fafafa'}}
        itemStyle={{
          justifyContent: 'flex-start'
        }}
        dropDownStyle={{backgroundColor: '#fafafa'}}
        //onChangeItem={item => setPickedMedicalService(item.value)}
        onChangeItem={item => serviceHandler(item.value, item.label)}
    />
  );

  const psychologicalServices = (
    <DropDownPicker
        items={[
            {label: 'Psychiatric Nurse - Online Session | 30 min', value: 'pn',
            },
            {label: 'Health Science Faculty - Online Session | 1 hour', value: 'hsf', 
            },
            {label: 'Commerce Faculty - Online Session | 1 hour', value: 'cf', 
            },
            {label: 'Law Faculty - Kramer Building Online Session | 1 hour', value: 'cov19',
            },
            {label: 'Graduate School of Business - Online Session | 1 hour', value: 'gsb',
            },
            {label: 'Social Worker Online Session | 1 hour', value: 'sw', 
            },
            {label: 'SWS Peer Counselling - Online Intervention | 40 min', value: 'sws', 
            },
            {label: 'Science Faculty - Maths Building Online Session | 1 hour', value: 'sfm',
            },
            {label: 'Hiddingh Campus - Online Session | 1 hour', value: 'hc',
            }
        ]}
        defaultValue={pickedPsychologicalService}
        placeholder="Select a Service"
        containerStyle={{height: 40}}
        style={{backgroundColor: '#fafafa'}}
        itemStyle={{
          justifyContent: 'flex-start'
        }}
        dropDownStyle={{backgroundColor: '#fafafa'}}
        onChangeItem={item => serviceHandler(item.value, item.label)}
    />
  );

    let newPickedService;
    let specificService;

    if (pickedItem === 'medical' || pickedItem === null) {
      newPickedService = medicalServices;
      specificService = pickedMedicalService;
    }
    else{
      newPickedService = psychologicalServices;
      specificService = pickedPsychologicalService;
    }

    return (  
      <View style={styles.screen}>
        <DropDownPicker
          items={[
              {label: 'Medical', value: 'medical', icon: () => 
                <Ionicons 
                  name={Platform.OS === 'android' ? 'md-medkit' : 'ios-medkit'} 
                  size={18} 
                  color="#900" 
                />
              },
              {label: 'Psychological', value: 'psychological', icon: () => 
                <Ionicons 
                  name={Platform.OS === 'android' ? 'md-medical' : 'ios-medical'} 
                  size={18} 
                  color="#900"
                />
              },
          ]}
          defaultValue={'medical'}
          placeholder="Select a Service"
          containerStyle={{height: 40}}
          style={{backgroundColor: '#fafafa'}}
          itemStyle={{
              justifyContent: 'flex-start'
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => setPickedItem(item.value)}
        />
        {newPickedService}
        <HorizontalCalendarList
          team={pickedItem} 
          service={pickedService}
          staff={staff}
          duration={duration}
          currentMarkedDates={markedDates} 
          currentBookingData={bookingData} 
          navigation={props.navigation}
        />
        
      </View> 
    );
  };
  
  export const screenOptions = navData => {
    return {
      headerTitle: 'Calendar',
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
      marginVertical: 10
    }
  });
  
  export default CalendarScreen;