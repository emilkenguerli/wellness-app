import Product from '../../models/event';

export const SET_EVENTS = 'SET_EVENTS';

export const fetchEvents = () => {
  return async (dispatch, getState) => {
    try {
        const response = await fetch(
            'http://192.168.50.136:9000/events/'
        );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const resData = await response.json();
      const loadedEvents = resData;
      // console.log(resData)
    //   for (const key in resData) {
    //     loadedEvents.push(
    //       new Product(
    //         key,
    //         resData[key].ownerId,
    //         resData[key].title,
    //         resData[key].imageUrl,
    //         resData[key].description,
    //         resData[key].price
    //       )
    //     );
    //   }

      dispatch({
        type: SET_EVENTS,
        events: loadedEvents,
      });
    } catch (err) {
      throw err;
    }
  };
};





