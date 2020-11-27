import { AUTHENTICATE, LOGOUT, SET_DID_TRY_AL, SET_PASSWORD } from '../actions/auth';

const initialState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
  email: '',
  name: '',
  studentNumber: '',
  phone: '',
  password: ''
};

/**
 * SET_PASSWORD: sets the password that has been retyped to the password state in redux store
 * AUTHENTICATE: sets the values dispatched upon login to the states defining the user
 * SET_DID_TRY_AL: sets the state of whether the user has tried to autologin or not to true
 * LOGOUT: sets the state of whether the user has tried to autologin or not to true
 */

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PASSWORD:
      return {
        ...state,
        password: action.password
      }
    case AUTHENTICATE:
      console.log(action.email);
      return {       
        token: action.token,
        userId: action.userId,
        didTryAutoLogin: true,
        email: action.email,
        name: action.name,
        studentNumber: action.studentNumber,
        phone: action.phone
      };
    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true
      };
    case LOGOUT:
      return {
        ...initialState,
        didTryAutoLogin: true
      };
    default:
      return state;
  }
};
