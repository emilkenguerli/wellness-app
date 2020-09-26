import moment, { min } from 'moment';

export const SET_TIMES = 'SET_TIMES';
export const RESET_TIMES = 'RESET_TIMES';

export const resetTimes = () => {
    return dispatch => {
      dispatch({
        type: RESET_TIMES
      });
    };
  };

export const setTimes = (times, service, date) => {
    return (dispatch, getState) => {
        const bookings = getState().bookings.items;
        
        for(let i = 0;i < bookings.length;i++){
            if(moment(bookings[i].start).format('YYYY-MM-DD') === date && bookings[i].service === service){
              let start = parseInt(moment(bookings[i].start).subtract(2, 'hours').format('HH')) * 60 + parseInt(moment(bookings[i].start).format('mm'));
              let end = parseInt(moment(bookings[i].end).subtract(2, 'hours').format('HH')) * 60 + parseInt(moment(bookings[i].end).format('mm'));
              let count = 0;
              let temp = [...times];
              for(let j = 0;j < times.length;j++){
                let now = parseInt(temp[count].slice(0,2)) * 60 + parseInt(temp[count].slice(3));
                if(start <= now && now < end){
                  temp.splice(count,1);
                  continue;
                }
                count ++;
              };
              times = [...temp];
            }    
          };

        dispatch({
            type: SET_TIMES,
            times: Object.assign(times.map((o, index) => ({name: o, key: index})))
        });
    };
  };