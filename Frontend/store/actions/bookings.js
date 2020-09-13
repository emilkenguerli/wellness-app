export const ADD_TO_BOOKINGS = 'ADD_TO_BOOKINGS';
export const REMOVE_FROM_BOOKINGS = 'REMOVE_FROM_BOOKINGS';
export const ADD_TO_STATE = 'ADD_TO_STATE';
export const REMOVE_FROM_STATE = 'REMOVE_FROM_STATE';
export const SET_BOOKINGS = 'SET_BOOKINGS';

// export const addToState = booking => {
//   return { type: ADD_TO_BOOKINGS, booking: booking };
// };

export const removeFromState = bookingID => {
  return { type: REMOVE_FROM_STATE, bid: bookingID };
};

export const fetchBookings = () => {
  return async (dispatch, getState) => {
    // any async code you want!
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'http://192.168.50.136:9000/bookings/'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      //console.log(resData)
      const loadedBookings = [];
      
      for(let i = 0;i < resData.length;i++){
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
      // send to custom analytics server
      throw err;
    }
  };
};

export const addToBookings = (booking) => {
  return async (dispatch, getState) => {
    // any async code you want!
    //const userId = getState().auth.userId;
    //console.log(booking);
    try {
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
              name: "Emil",
              studentNumber: "KNGEMI002",
              email: getState().auth.email,
              phone: "XXXXXXXXXX"
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
      //console.log(resData);
      console.log("yo");
      const newBooking = {
        bookingID: resData._id,
        staffId: resData.staffId,
        team: resData.team,
        service: resData.service,
        start: resData.start,
        end: resData.end,
        note: resData.note,
        student: resData.student,
        canceled: resData.canceled,
        dna: resData.dna
      };
      
      dispatch({
        type: ADD_TO_BOOKINGS,
        booking: newBooking,
      });
      
    } catch (err) {
      // send to custom analytics server
      throw err;
    }
  };
};

export const removeFromBookings = (bookingID) => {
  return async (dispatch, getState) => {
    // any async code you want!
    //const userId = getState().auth.userId;
    //console.log(getState().bookings.items);
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
      // send to custom analytics server
      throw err;
    }
  };
};