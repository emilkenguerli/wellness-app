import { AsyncStorage, Alert } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';
export const SET_DID_TRY_AL = 'SET_DID_TRY_AL';
export const SET_PASSWORD = 'SET_PASSWORD';

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const setPassword = (password) => {
  return dispatch => {
    dispatch({
      type: SET_PASSWORD,
      password: password
    });
  };
};

export const authenticate = (userId, token, expiryTime, email, name, studentNum, phone) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime));
        dispatch({ type: AUTHENTICATE, userId: userId, token: token, email: email, name: name,
                  studentNumber: studentNum, phone: phone });
    };
};

export const sendVerificationCode = (email, formState) => {
  return async dispatch => {
    if(!formState){
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
        }else if (errorId === 'EMAIL_NOT_CONFIRMED'){
          message = 'This email has not been confirmed yet!';
        }
        throw new Error(message);
    }
    
    const resData = await response.json();
    console.log(resData);
    
    
  };
}

export const verifyCode = (code, formState) => {
  return async dispatch => {
    if(!formState){
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

export const resetPassword = (password, code, formState1, formState2) => {
  return async dispatch => {
    if(!formState1 || !formState2){
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
        }else if(errorId === 'USER_REMOVED'){
          message = 'The user no longer exists!';
        }
        throw new Error(message);
    }
    
    const resData = await response.json();
    console.log(resData);
       
  };
}

export const signup = (email, password, name, studentNumber, phoneNumber, formState) => {
    return async dispatch => {
        if(!formState){
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
