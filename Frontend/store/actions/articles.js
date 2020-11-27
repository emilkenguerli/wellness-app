export const SET_ARTICLES = 'SET_ARTICLES';

/**
 * Send a GET Request over an establised HTTPUrlConnection to fetch the articles from the
 * database. It then saves these articles to the state in the articles reducer
 */
//192.168.50.136
//10.0.2.2
export const fetchArticles = () => {
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
      for (let i = 0; i < resData.length; i++) {
        loadedTitles[i] = resData[i].title;
      }

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