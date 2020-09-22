import { AsyncStorage, Alert } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const authenticate = (userId, token, expiryTime, email) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token, email: email });
    };
};

export const signup = (email, password) => {
  console.log("hello");
    return async dispatch => {
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
                    studentNum: "Chang",
                    phone: "XXXXXXXX",
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
        Alert.alert('Sign up complete', 'A confirmation email has been sent to your address, please go and press the link. Check spam folder as well', [{ text: 'Okay' }]);
        // dispatch(
        //     authenticate(
        //         resData.user._id,
        //         resData.token,
        //         parseInt(resData.expiresIn) * 1000,
        //         email
        //     )
        // );
        // const expirationDate = new Date(
        //     new Date().getTime() + parseInt(resData.expiresIn) * 1000
        // );
        // saveDataToStorage(resData.token, resData.user._id, expirationDate);
    };
};
//192.168.50.136
//10.0.2.2
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
          } else if (errorId === 'EMAIL_NOT_CONFIRMED'){
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
                email
            )
        );
        const expirationDate = new Date(
            new Date().getTime() + parseInt(resData.expiresIn) * 1000
          );
        saveDataToStorage(resData.token, resData.user._id, expirationDate);
    };
};

export const logout = () => {
    clearLogoutTimer();
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const clearLogoutTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
      timer = setTimeout(() => {
        dispatch(logout());
      }, expirationTime);
    };
};

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
