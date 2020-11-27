import {
  SET_TIMES,
  RESET_TIMES
} from '../actions/calendar';

const initialState = {
  availableTimes: [],
};

/**
 * SET_TIMES: sets the availableTimes state to the times available for the current date selected
 * RESET_TIMES: sets the availableTimes state to it's initial state
 */

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_TIMES:
      return {
        availableTimes: action.times
      };
    case RESET_TIMES:
      return {
        availableTimes: []
      };
  }
  return state;
};