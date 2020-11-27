import {
  SET_ARTICLES
} from '../actions/articles';

const initialState = {
  availableArticles: [],
  availableTitles: []
};

/**
 * SET_ARTICLES: sets the articles fetched from the database to the states defined in the redux store
 */

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ARTICLES:
      return {
        availableArticles: action.articles,
        availableTitles: action.titles
      };

  }
  return state;
};