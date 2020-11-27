import React, { useMemo, useState, useEffect } from 'react';
import { Animated, StatusBar, StyleSheet, TextInput, View, Text, Dimensions, Platform } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

const deviceWidth = Dimensions.get('window').width;

/**
 * Reusable search bar custom component, it is displayed at the top of the Articles Screen and allows 
 * the user to search for articles of interest
 * @param {*} props 
 */

const Search = (props) => {
  const {
    clampedScroll
  } = props;
  const [textInputFocussed, setTextInputFocussed] = useState(false);
  const searchBarTranslate = clampedScroll.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -(250)],
    extrapolate: 'clamp',
  });
  const searchBarOpacity = clampedScroll.interpolate({
    inputRange: [0, 10],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const [searchTerm, setSearchTerm] = useState(props.searchedTerm);

  /**
   * This is a React hook and is called whenever the value of the searched term changes.
   * It returns the list of items that correspond to the searched term dynamically as 
   * the user types.
   */

  const temporarySearchResults = useMemo(() => {
    const list = props.titles.filter((name) => {
      return name.toLowerCase().includes(searchTerm.toLowerCase())
    })
    return list;
  }, [searchTerm])

  /**
   * When the user presses off the search bar, the list of articles that match the searched word are listed
   * under the search bar
   */

  const handleBlur = () => {
    setTextInputFocussed(false);
    props.setSearchedTerm(searchTerm)
  }

  /**
   * This renders the list of articles that match the word the user has searched for and if no 
   * matching articles are found, "No match found" is displayed
   */

  const renderSearchList = () => {
    return (
      <View style={styles.searchList}>
        {
          temporarySearchResults.length === 0 && (
            <View style={styles.searchListItem}>
              <Text style={styles.searchListItemText}>
                No match found
              </Text>
            </View>
          )
        }
        {
          temporarySearchResults.slice(0, 3).map((name, index) => {
            return (
              <View key={index} style={styles.searchListItem}>
                <Text style={styles.searchListItemText}>{name}</Text>
              </View>
            )
          })
        }
        {
          temporarySearchResults.length !== 0 && <TouchableOpacity onPress={() => {
            props.setSearchedTerm(searchTerm);

          }}>
            <View style={styles.searchListItem}>
              <Text style={[
                styles.searchListItemText,
                {
                  color: '#ff5d51'
                }
              ]}>See all ({temporarySearchResults.length}) names</Text>
            </View>
          </TouchableOpacity>
        }
      </View>
    )
  }

  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [
          {
            translateY: searchBarTranslate
          }
        ],
        opacity: searchBarOpacity,
      }
    ]}>
      <View style={styles.searchSection}>
        <TextInput
          defaultValue={props.searchedTerm}
          placeholder='Search'
          style={styles.formField}
          placeholderTextColor={'#888888'}
          onFocus={() => setTextInputFocussed(true)}
          onBlur={handleBlur}
          onChange={(event) => setSearchTerm(event.nativeEvent.text)}
          returnKeyType='send'
          value={searchTerm}
          onSubmitEditing={() => props.setSearchedTerm(searchTerm)}
        />
        <TouchableOpacity onPress={() => {setSearchTerm('')}}>
          <Ionicons
            style={{ padding: 10 }}
            name={Platform.OS === 'android' ? 'md-close' : 'ios-close'}
            size={30}
            color="#696969"
          />
        </TouchableOpacity>
      </View>
      {
        (textInputFocussed) && (
          <View style={{
            position: 'absolute',
            backgroundColor: '#FFFFFF',
            top: StatusBar.currentHeight + 58,
            left: 0,
            zIndex: 9999,
            width: deviceWidth,
            height: 800,
          }}>
            {searchTerm.length > 0 && renderSearchList()}
          </View>
        )
      }
    </Animated.View>
  )
}

/**
 * The styles used for the search bar and list
 */

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: deviceWidth,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
    position: Platform.OS === 'ios' ? 'absolute' : 'relative',
  },
  formField: {
    backgroundColor: '#F4F4F4',
    width: deviceWidth - 60,
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    fontSize: 18,
    height: 50
  },
  searchList: {
    paddingLeft: 30
  },
  searchListItem: {
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    paddingRight: 16,
    borderColor: '#DBDBDB',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  searchListItemText: {
    fontSize: 20,
    maxWidth: '85%',
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  }
})

export default Search;