import React, { useEffect, useState } from 'react';
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

import HeaderButton from '../../components/UI/HeaderButton';
import Colors from '../../constants/Colors';
import HorizontalCalendarList from '../../components/Booking/horizontalCalendarList';
import { ScrollView } from 'react-native-gesture-handler';


const CalendarScreen = props => {
  const [pickedItem, setPickedItem] = useState(null);
  const [pickedMedicalService, setPickedMedicalService] = useState(null);
  const [pickedPsychologicalService, setPickedPsychologicalService] = useState(null);

  const medicalServices = (
    <DropDownPicker
        items={[
            {label: 'Online - Medical Officer', value: 'omf',
            },
            {label: 'Triage Nurse - Online Advice', value: 'tnoa', 
            },
            {label: 'Telephonic Nurse Advice', value: 'tna', 
            },
            {label: 'COVID-19 Student Hotline Queries', value: 'cov19',
            },
            {label: 'Online Psychiatrist Session', value: 'ops',
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
        onChangeItem={item => setPickedMedicalService(item.value)}
    />
  );

  const psychologicalServices = (
    <DropDownPicker
        items={[
            {label: 'Psychiatric Nurse - Online Session', value: 'pn',
            },
            {label: 'Health Science Faculty - Online Session', value: 'hsf', 
            },
            {label: 'Commerce Faculty - Online Session', value: 'cf', 
            },
            {label: 'Law Faculty - Kramer Building Online Session', value: 'cov19',
            },
            {label: 'Graduate School of Business - Online Session', value: 'gsb',
            },
            {label: 'Social Worker Online Session', value: 'sw', 
            },
            {label: 'SWS Peer Counselling - Online Intervention', value: 'sws', 
            },
            {label: 'Science Faculty - Maths Building Online Session', value: 'sfm',
            },
            {label: 'Hiddingh Campus - Online Session', value: 'hc',
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
        onChangeItem={item => setPickedPsychologicalService(item.value)}
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
        <HorizontalCalendarList service={specificService} />
        
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