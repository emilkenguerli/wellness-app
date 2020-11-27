import { AsyncStorage, Alert } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';
export const SET_PASSWORD = 'SET_PASSWORD';

let timer; // Of the token before it expires

/**
 * Returns the state of whether the user has tried to login and hasn't logged out yet
 */

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

/**
 * Sets the state of the retyped password in the redux store to the one dispatched
 * @param {*} password : password entered by the user into the retype password text field
 */

export const setPassword = (password) => {
  return dispatch => {
    dispatch({
      type: SET_PASSWORD,
      password: password
    });
  };
};

/**
 * Sets the state of all the user details and token in the redux store to the values dispatched
 * @param {*} userId : the user id 
 * @param {*} token : the JWEB token of the user
 * @param {*} expiryTime : the expiry time of the token
 * @param {*} email : the email address of the user
 * @param {*} name : the name of the user
 * @param {*} studentNum : the student number of the user
 * @param {*} phone : the phone number of the user
 */

export const authenticate = (userId, token, expiryTime, email, name, studentNum, phone) => {
  return dispatch => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({
      type: AUTHENTICATE, userId: userId, token: token, email: email, name: name,
      studentNumber: studentNum, phone: phone
    });
  };
};

/**
 * Send a POST Request over an establised HTTPUrlConnection to send a verification code
 * to the email address of the user.
 * @param {*} email : the email entered into the text field
 * @param {*} formState : the form of all the inputs, whether they are all valid or not
 */

export const sendVerificationCode = (email, formState) => {
  return async dispatch => {
    if (!formState) {
      throw new Error("Invalid email entered.");
    }
    const response = await fetch(
      "http://192.168.50.136:9000/sendVerification",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'EMAIL_NOT_CONFIRMED') {
        message = 'This email has not been confirmed yet!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);


  };
}

/**
 * Send a POST Request over an establised HTTPUrlConnection to verify if the code entered by the
 * use is the same one that is saved with that user object in the database.
 * @param {*} code : the code entered by the user
 * @param {*} formState : the form of all the inputs, whether they are all valid or not
 */

export const verifyCode = (code, formState) => {
  return async dispatch => {
    if (!formState) {
      throw new Error("Invalid code entered.");
    }
    const response = await fetch(
      "http://192.168.50.136:9000/verifyCode",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code
        })
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error;
      let message = 'Something went wrong!';
      if (errorId === 'INCORRECT_CODE') {
        message = 'Incorrect code entered!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);

  };
}

/**
 * Send a POST Request over an establised HTTPUrlConnection to update the password of the
 * user in the database.
 * @param {*} password : the new password entered by the user
 * @param {*} code : the code used to verify the user
 * @param {*} formState1 : the form of the first password
 * @param {*} formState2 : the form of the retyped password
 */

export const resetPassword = (password, code, formState1, formState2) => {
  return async dispatch => {
    if (!formState1 || !formState2) {
      throw new Error("Invalid password entered.");
    }
    const response = await fetch(
      "http://192.168.50.136:9000/resetPassword",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: password,
          code: code
        })
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error;
      let message = 'Something went wrong!';
      if (errorId === 'NO_PASSWORD') {
        message = 'No password entered!';
      } else if (errorId === 'USER_REMOVED') {
        message = 'The user no longer exists!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);

  };
}

/**
 * Send a POST Request over an establised HTTPUrlConnection to register a new user
 * @param {*} email : the email address of the user
 * @param {*} password : the password of the user
 * @param {*} name : the name of the user
 * @param {*} studentNumber : the student number of the user
 * @param {*} phoneNumber : the phone number of the user
 * @param {*} formState : the form of all the inputs, whether they are all valid or not
 */

export const signup = (email, password, name, studentNumber, phoneNumber, formState) => {
  return async dispatch => {
    if (!formState) {
      throw new Error("Something wasn't entered correctly.");
    }
    const response = await fetch(
      "http://192.168.50.136:9000/signup",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
          studentNum: studentNumber,
          phone: phoneNumber,
          bookings: []
        })
      }
    );
    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    Alert.alert(
      'Sign up complete', 
      'A confirmation email has been sent to your address, please go and press the link. Check spam folder as well', 
      [{ text: 'Okay' }]);
  };
};

/**
 * Send a POST Request over an establised HTTPUrlConnection to verify the user's details before
 * letting them login into the app.
 * @param {*} email : the email address entered by the user
 * @param {*} password : the password entered by the user 
 */

export const login = (email, password) => {
  return async dispatch => {
    const response = await fetch(
      "http://192.168.50.136:9000/signin",
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
        })
      }
    );

    if (!response.ok) {
      const errorResData = await response.json();
      const errorId = errorResData.error;
      let message = 'Something went wrong!';
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      } else if (errorId === 'EMAIL_NOT_CONFIRMED') {
        message = 'This email has not been confirmed yet!';
      }
      throw new Error(message);
    }

    const resData = await response.json();
    console.log(resData);
    dispatch(
      authenticate(
        resData.user._id,
        resData.token,
        parseInt(resData.expiresIn) * 1000,
        email,
        resData.user.name,
        resData.user.studentNum,
        resData.user.phone
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(resData.expiresIn) * 1000
    );
    saveDataToStorage(resData.token, resData.user._id, expirationDate);
  };
};

/**
 * Removed the user data from persistent memory so that they can no longer autologin, and they will
 * be returned to the login screen
 */

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

/**
 * Resets the timer for the expiry date of the token
 */

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

/**
 * Sets how much time is left before the user has to log out
 * @param {*} expirationTime : the amount of time the token has before it expires
 */

const setLogoutTimer = expirationTime => {
  return dispatch => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

/**
 * Saves the user data to persistent memory so that even if they log out the state will not
 * be changed.
 * @param {*} token : the JWEB token
 * @param {*} userId : the id of the user logged in
 * @param {*} expirationDate : the date that the token will have expired by 
 */

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expiryDate: expirationDate.toISOString()
    })
  );
};
