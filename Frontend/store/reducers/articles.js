import {
    SET_ARTICLES
  } from '../actions/articles';
  //import Event from '../../models/event';
  
  const initialState = {
    availableArticles: [],
    availableTitles: []
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case SET_ARTICLES:
          //console.log(action.articles);
        return {
            availableArticles: action.articles,
            availableTitles: action.titles
        };
      
    }
    return state;
  };