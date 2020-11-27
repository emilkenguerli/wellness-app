import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk';

import authReducer from './store/reducers/auth';
import bookingsReducer from './store/reducers/bookings';
import eventsReducer from './store/reducers/events';
import articlesReducer from './store/reducers/articles';
import calendarReducer from './store/reducers/calendar';
import AppNavigator from './navigation/AppNavigator';

const rootReducer = combineReducers({
  auth: authReducer,
  bookings: bookingsReducer,
  events: eventsReducer,
  articles: articlesReducer,
  calendar: calendarReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

/**
 * Fetches the fonts defined in assests so that it can be used anywhere in the app
 */

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

/**
 * This is the driver class that is first run upon app start up, it intiates the navigators
 */

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}

