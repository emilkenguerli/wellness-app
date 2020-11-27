export const SET_EVENTS = 'SET_EVENTS';

/**
 * Send a GET Request over an establised HTTPUrlConnection to fetch the events from the
 * database. It then saves these events to the state in the events reducer
 */

export const fetchEvents = () => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(
        'http://192.168.50.136:9000/events/'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedEvents = resData;

      dispatch({
        type: SET_EVENTS,
        events: loadedEvents,
      });
    } catch (err) {
      throw err;
    }
  };
};





