import {
  SET_EVENTS
} from '../actions/events';

const initialState = {
  availableEvents: [],
};

/**
 * SET_ARTICLES: sets the availableEvents state to the events fetched from the database 
 */

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return {
        availableEvents: action.events
      };

  }
  return state;
};