export const ADD_TO_BOOKINGS = 'ADD_TO_BOOKINGS';
export const REMOVE_FROM_BOOKINGS = 'REMOVE_FROM_BOOKINGS';
export const ADD_TO_STATE = 'ADD_TO_STATE';
export const REMOVE_FROM_STATE = 'REMOVE_FROM_STATE';
export const SET_BOOKINGS = 'SET_BOOKINGS';

/**
 * A single booking is removed from the state of the redux store in the reducer
 * @param {*} bookingID : the id of a particular booking object
 */

export const removeFromState = bookingID => {
  return { type: REMOVE_FROM_STATE, bid: bookingID };
};

/**
 * Send a GET Request over an establised HTTPUrlConnection to fetch the bookings from the
 * database. It then saves these bookings to the state in the bookings reducer
 */

export const fetchBookings = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'http://192.168.50.136:9000/bookings/'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedBookings = [];

      for (let i = 0; i < resData.length; i++) {
        const newBooking = {
          bookingID: resData[i]._id,
          staffId: resData[i].staffId,
          team: resData[i].team,
          service: resData[i].service,
          start: resData[i].start,
          end: resData[i].end,
          note: resData[i].note,
          student: resData[i].student,
          canceled: resData[i].canceled,
          dna: resData[i].dna
        };
        loadedBookings[i] = newBooking;
      }
      dispatch({
        type: SET_BOOKINGS,
        bookings: loadedBookings,
      });

    } catch (err) {
      throw err;
    }
  };
};

/**
 * Send a POST Request over an establised HTTPUrlConnection to add a booking to the
 * database. It then dispatches to the reducer to add this booking to the state of
 * available bookings in the redux store
 * @param {*} booking : booking object 
 */

export const addToBookings = (booking) => {
  return async (dispatch, getState) => {
    try {
      console.log(getState().auth.email);
      const response = await fetch(
        'http://192.168.50.136:9000/bookings/add',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            staffId: booking.staffId,
            team: booking.team,
            service: booking.service,
            start: booking.start,
            end: booking.end,
            note: booking.note,
            student: {
              name: getState().auth.name,
              studentNumber: getState().auth.studentNumber,
              email: getState().auth.email,
              phone: getState().auth.phone
            },
            canceled: false,
            dna: false
          })
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const newBooking = {
        bookingID: resData.booking._id,
        staffId: resData.booking.staffId,
        team: resData.booking.team,
        service: resData.booking.service,
        start: resData.booking.start,
        end: resData.booking.end,
        note: resData.booking.note,
        student: resData.booking.booking.student,
        canceled: resData.canceled,
        dna: resData.booking.dna
      };

      dispatch({
        type: ADD_TO_BOOKINGS,
        booking: newBooking,
      });

    } catch (err) {
      throw err;
    }
  };
};

/**
 * Send a POST Request over an establised HTTPUrlConnection to remove a booking from the
 * database. It then dispatches to the reducer to remove this booking from the state of
 * available bookings in the redux store
 * @param {*} booking : booking object 
 */

export const removeFromBookings = (bookingID) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch(
        'http://192.168.50.136:9000/bookings/remove',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: bookingID
          })
        }
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();

      dispatch({
        type: REMOVE_FROM_BOOKINGS,
        bid: bookingID
      });

    } catch (err) {
      throw err;
    }
  };
};