import { AUTHENTICATE, LOGOUT, SET_DID_TRY_AL, SET_PASSWORD} from '../actions/auth';

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

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_PASSWORD:
      return {
        ...state,
        password: action.password
      }
    case AUTHENTICATE:
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
