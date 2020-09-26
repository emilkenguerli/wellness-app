import {
    SET_TIMES,
    RESET_TIMES
  } from '../actions/calendar';
  //import Event from '../../models/event';
  
  const initialState = {
    availableTimes: [],
  };
  
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