import React, { useEffect, useState, useCallback } from 'react';
import {
  Platform,
  StyleSheet
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import moment from 'moment';
import { LinearGradient } from 'expo-linear-gradient';

import HeaderButton from '../../components/UI/HeaderButton';
import HorizontalCalendarList from '../../components/Booking/horizontalCalendarList';
import * as bookingsActions from '../../store/actions/bookings';
import * as calendarActions from '../../store/actions/calendar';

/**
 * This renders all the components on the Calendar screen with the filters and calendar being
 * rendered initially and the list only being rendered in the horizontal calendar component when 
 * a date and service are selected.
 * @param {*} props 
 */

const CalendarScreen = (props) => {
  const [pickedItem, setPickedItem] = useState('medical');
  const [pickedMedicalService, setPickedMedicalService] = useState(null);
  const [pickedPsychologicalService, setPickedPsychologicalService] = useState(null);
  const [pickedService, setPickedService] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const [bookingData, setBookingData] = useState([]);
  const [staff, setStaff] = useState([]);
  const [duration, setDuration] = useState(0);
  const [times, setTimes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const bookings = useSelector(state => state.bookings.items);
  const dispatch = useDispatch();

  /**
   * This React hook deals with refreshing and dispatching actions to the redux store in order to 
   * load bookings from the database
   */

  const loadBookings = useCallback(async () => {
    setError(null);
    try {
      await dispatch(bookingsActions.fetchBookings());
    } catch (err) {
      setError(err.message);
    }
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

  /**
   * This React hook checks to see if a team/service has been selected/changed by a user. If so, then
   * it sets the duration of the appointment based on which service was selected, initialises a dataset
   * including all dates from the current date up unitil 4 months from then with weekends being excluded,
   * runs through the dataset calculated above and removes the dates that don't have times associated
   * with them, lastly it checks if there are any available dates left and whether a service was selected
   * and if yes then it dispatches an action to the reduct store to change state value of marked dates
   * to those dates that are available for that particular service
   */

  useEffect(() => {
    dispatch(calendarActions.resetTimes());
    setMarkedDates({});
    setStaff(['Anyone', 'Musa', 'Emil', 'Bonnie']);

    // Sets the duration

    let tduration = 0;
    if (specificService === 'omf' || specificService === 'tnoa' || specificService === 'tna' ||
      specificService === 'pn') {
      setDuration(30);
      tduration = 30;
    }
    else if (specificService === 'cov19') {
      setDuration(20);
      tduration = 20;
    }
    else if (specificService === 'sws') {
      setDuration(40);
      tduration = 40;
    }
    else {
      setDuration(60);
      tduration = 60;
    }

    let timelist = [];
    if (tduration === 60) {
      timelist = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
    } else if (tduration === 30) {
      timelist = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00',
        '13:30', '14:00', '14:30'];
    } else if (tduration === 20) {
      timelist = [];
    } else {
      timelist = ['14:50', '15:40', '16:30', '17:20', '18:10']
    }

    setTimes(timelist);

    // Initialises the dataset 

    let alldates = [];
    let count = 0;

    for (let i = 0; i < 120; i++) {
      if (moment().add(i, 'days').format('dddd') === "Saturday" ||
        moment().add(i, 'days').format('dddd') === "Sunday") {
        continue;
      }
      alldates[count] = moment().add(i, 'days').format('YYYY-MM-DD');
      count++;
    };

    // Removes the dates that don't have times associated with them

    let tempAllDates = [...alldates];
    let count2 = 0;

    for (let i = 0; i < alldates.length; i++) {
      let tempTimeList = [...timelist];
      for (let j = 0; j < bookings.length; j++) {
        let start = parseInt(moment(bookings[j].start).subtract(2, 'hours').format('HH')) * 60 +
          parseInt(moment(bookings[j].start).format('mm'));
        let end = parseInt(moment(bookings[j].end).subtract(2, 'hours').format('HH')) * 60 +
          parseInt(moment(bookings[j].end).format('mm'));
        let count = 0;
        let temp = [...tempTimeList];
        for (let k = 0; k < tempTimeList.length; k++) {
          let now = parseInt(temp[count].slice(0, 2)) * 60 + parseInt(temp[count].slice(3));
          if (start <= now && now < end) {
            temp.splice(count, 1);
            continue;
          }
          count++;
        };
        tempTimeList = [...temp];
      };
      if (tempTimeList.length === 0 || tempTimeList === null) {
        tempAllDates.splice(count2, 1);
        continue;
      }
      count2++;
    };
    alldates = [...tempAllDates];

    // Dispatches action to set marked dates 

    if (specificService !== null && alldates.length !== 0) {
      setMarkedDates(Object.assign(...alldates.map(o => ({ [o]: { selected: true, selectedColor: '#DFA460' } }))));
    }

  }, [pickedMedicalService, pickedPsychologicalService, pickedItem])

  /**
   * Sets the value for the new service selected by the user based on which team the chose
   * @param {*} value : the key code of the service
   * @param {*} service : the name of the service
   */

  const serviceHandler = (value, service) => {
    if (pickedItem === 'medical') {
      setPickedMedicalService(value, service);
    } else {
      setPickedPsychologicalService(value, service);
    }
    setPickedService(service);
  };

  const medicalServices = (
    <DropDownPicker
      items={[
        {
          label: 'Online - Medical Officer | 30 min', value: 'omf',
        },
        {
          label: 'Triage Nurse - Online Advice | 30 min', value: 'tnoa',
        },
        {
          label: 'Telephonic Nurse Advice | 30 min', value: 'tna',
        },
        {
          label: 'COVID-19 Student Hotline Queries | 20 min', value: 'cov19',
        },
        {
          label: 'Online Psychiatrist Session | 1 hour', value: 'ops',
        }
      ]}
      defaultValue={pickedMedicalService}
      placeholder="Select a Service"
      containerStyle={{ height: 40 }}
      style={{ backgroundColor: '#fafafa' }}
      itemStyle={{
        justifyContent: 'flex-start'
      }}
      dropDownStyle={{ backgroundColor: '#fafafa' }}
      onChangeItem={item => serviceHandler(item.value, item.label)}
    />
  );

  const psychologicalServices = (
    <DropDownPicker
      items={[
        {
          label: 'Psychiatric Nurse - Online Session | 30 min', value: 'pn',
        },
        {
          label: 'Health Science Faculty - Online Session | 1 hour', value: 'hsf',
        },
        {
          label: 'Commerce Faculty - Online Session | 1 hour', value: 'cf',
        },
        {
          label: 'Law Faculty - Kramer Building Online Session | 1 hour', value: 'cov19',
        },
        {
          label: 'Graduate School of Business - Online Session | 1 hour', value: 'gsb',
        },
        {
          label: 'Social Worker Online Session | 1 hour', value: 'sw',
        },
        {
          label: 'SWS Peer Counselling - Online Intervention | 40 min', value: 'sws',
        },
        {
          label: 'Science Faculty - Maths Building Online Session | 1 hour', value: 'sfm',
        },
        {
          label: 'Hiddingh Campus - Online Session | 1 hour', value: 'hc',
        }
      ]}
      defaultValue={pickedPsychologicalService}
      placeholder="Select a Service"
      containerStyle={{ height: 40 }}
      style={{ backgroundColor: '#fafafa' }}
      itemStyle={{
        justifyContent: 'flex-start'
      }}
      dropDownStyle={{ backgroundColor: '#fafafa' }}
      onChangeItem={item => serviceHandler(item.value, item.label)}
    />
  );

  // Checks which team was selected by the user and changes the value of the specificService so that
  // the appropriate drop down picker showing the relevent services based on the service picked is
  // rendered

  let newPickedService;
  let specificService;

  if (pickedItem === 'medical' || pickedItem === null) {
    newPickedService = medicalServices;
    specificService = pickedMedicalService;
  }
  else {
    newPickedService = psychologicalServices;
    specificService = pickedPsychologicalService;
  }

  return (
    <LinearGradient colors={['#e6e6fa', '#e6e6fa']} style={styles.screen} >
      <DropDownPicker
        items={[
          {
            label: 'Medical', value: 'medical', icon: () =>
              <Ionicons
                name={Platform.OS === 'android' ? 'md-medkit' : 'ios-medkit'}
                size={18}
                color="#900"
              />
          },
          {
            label: 'Psychological', value: 'psychological', icon: () =>
              <Ionicons
                name={Platform.OS === 'android' ? 'md-medical' : 'ios-medical'}
                size={18}
                color="#900"
              />
          },
        ]}
        defaultValue={'medical'}
        placeholder="Select a Team"
        containerStyle={{ height: 40 }}
        style={{ backgroundColor: '#fafafa' }}
        itemStyle={{
          justifyContent: 'flex-start'
        }}
        dropDownStyle={{ backgroundColor: '#fafafa' }}
        onChangeItem={item => setPickedItem(item.value)}
      />
      {newPickedService}
      <HorizontalCalendarList
        team={pickedItem}
        service={pickedService}
        staff={staff}
        duration={duration}
        times={times}
        currentMarkedDates={markedDates}
        currentBookingData={bookingData}
        navigation={props.navigation}
      />

    </LinearGradient>
  );
};

/**
 * This renders the menu hamburger icon on the top left of the screen as well as setting the header
 * title of the screen to Calendar
 * @param {*} navData : navigation data from the BookingNavigator
 */

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

/**
 * The styles for the Calendar Screen component
 */

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginVertical: 10
  }
});

export default CalendarScreen;