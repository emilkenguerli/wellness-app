export const SET_ARTICLES = 'SET_ARTICLES';

export const fetchArticles = () => {
    //console.log("y9");
  return async (dispatch, getState) => {
    try {
        const response = await fetch(
            'http://192.168.50.136:9000/articles/'
        );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      
      const resData = await response.json();
      const loadedArticles = resData;

      let loadedTitles = [];
      for(let i = 0;i < resData.length;i++){
        loadedTitles[i] = resData[i].title;
      }

      //console.log(titles);
      dispatch({
        type: SET_ARTICLES,
        articles: loadedArticles,
        titles: loadedTitles
      });
    } catch (err) {
      throw err;
    }
  };
};