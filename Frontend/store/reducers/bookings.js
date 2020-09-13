import { ADD_TO_BOOKINGS, REMOVE_FROM_BOOKINGS, ADD_TO_STATE, REMOVE_FROM_STATE, SET_BOOKINGS} from '../actions/bookings';
import Booking from '../../models/booking';

const initialState = {
    items: {}
};

export default (state = initialState, action) => {
    switch (action.type) {   
      case SET_BOOKINGS:
        return {
          items: action.bookings,
        };
      case ADD_TO_BOOKINGS:
        const addedBooking = action.booking;
        const bookingID = addedBooking.bookingID;
        const bookingStaffId= addedBooking.staffId;
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
        //console.log(newBookingsItem);
        return {
          ...state,
          items: { ...state.items, [bookingID]: newBookingsItem },
        };
      case REMOVE_FROM_BOOKINGS:
        // Change the state of id where you dispatch action
        //const selectedCartItem = state.items[action.bid];
        let updatedBookings;
        
        updatedBookings = { ...state.items };
        delete updatedBookings[action.bid];

        //let arr = Object.values(state.items);
        //console.log(arr.length);
        // for(let i = 0;i < arr.length;i++){
        //   if(arr[i].id === 0){
        //     continue;
        //   }
        //   else{
        //     arr[i].id = (parseInt(arr[i].id) - 1).toString();
        //   }
        // };
        // console.log(state.items);
        // console.log('----------------------------------------------');
        // console.log(Object.assign({}, arr));
        
        // state.items = Object.assign({}, arr);
        
        return {
          ...state,
          items: updatedBookings
        };
      default:
          return state;
    }    
};