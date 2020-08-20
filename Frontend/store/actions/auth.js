import { AsyncStorage } from 'react-native';
//import axios from 'axios';

// export const SIGNUP = 'SIGNUP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

export const authenticate = (token) => {
    return dispatch => {
        dispatch({ type: AUTHENTICATE, token: token });
    };
};

export const signup = (email, password) => {
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
                    password: password
                })
            }
        );

        if (!response.ok) {
            const errorResData = await response.json();
            const errorId = errorResData.error.message;
            let message = 'Something went wrong!';
            if (errorId === 'EMAIL_EXISTS') {
                message = 'This email exists already!';
            }
            throw new Error(message);
        }

        const resData = await response.json();
        console.log(resData);
        dispatch(
            authenticate(
                resData.token
            )
        );
        saveDataToStorage(resData.token);
    };
};

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
          const errorId = errorResData.error.message;
          let message = 'Something went wrong!';
          if (errorId === 'EMAIL_NOT_FOUND') {
            message = 'This email could not be found!';
          } else if (errorId === 'INVALID_PASSWORD') {
            message = 'This password is not valid!';
          }
          throw new Error(message);
        }

        const resData = await response.json();
        console.log(resData);
        dispatch(
        authenticate(
            resData.token,
        )
        );
        saveDataToStorage(resData.token);
    };
};

export const logout = () => {
    AsyncStorage.removeItem('userData');
    return { type: LOGOUT };
};

const saveDataToStorage = (token, userId) => {
    AsyncStorage.setItem(
        'userData',
        JSON.stringify({
            token: token
        })
    );
};
