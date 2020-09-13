import {
  SET_EVENTS
} from '../actions/events';
//import Event from '../../models/event';

const initialState = {
  availableEvents: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_EVENTS:
      return {
        availableEvents: action.events
      };
    
  }
  return state;
};