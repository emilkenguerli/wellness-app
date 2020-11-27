import { ADD_TO_BOOKINGS, REMOVE_FROM_BOOKINGS, ADD_TO_STATE, REMOVE_FROM_STATE, SET_BOOKINGS } from '../actions/bookings';
import Booking from '../../models/booking';

const initialState = {
  items: {}
};

/**
 * SET_BOOKINGS: sets the bookings fetched from the database to the items state
 * ADD_TO_BOOKINGS: adds a booking object created to the items state
 * REMOVE_FROM_BOOKINGS: removes a booking object from the items state
 */

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_BOOKINGS:
      return {
        items: action.bookings,
      };
    case ADD_TO_BOOKINGS:
      const addedBooking = action.booking;
      const bookingID = addedBooking.bookingID;
      const bookingStaffId = addedBooking.staffId;
      const bookingTeam = addedBooking.team;
      const bookingService = addedBooking.service;
      const bookingStart = addedBooking.start;
      const bookingEnd = addedBooking.end;
      const bookingNote = addedBooking.note;
      const bookingStudent = addedBooking.student;
      const bookingCancelled = addedBooking.cancelled;
      const bookingDna = addedBooking.dna;

      let newBookingsItem;
      newBookingsItem = new Booking(
        bookingID, bookingStaffId, bookingTeam, bookingService, bookingStart, bookingEnd,
        bookingNote, bookingStudent, bookingCancelled, bookingDna
      );
      console.log(newBookingsItem);
      return {
        ...state,
        items: { ...state.items, [bookingID]: newBookingsItem },
      };
    case REMOVE_FROM_BOOKINGS:
      let updatedBookings;

      updatedBookings = { ...state.items };
      delete updatedBookings[action.bid];
      return {
        ...state,
        items: updatedBookings
      };
    default:
      return state;
  }
};