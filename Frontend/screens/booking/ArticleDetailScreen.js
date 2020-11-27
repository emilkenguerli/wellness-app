import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';
import { useSelector } from 'react-redux';
import 'react-native-gesture-handler';

import moment from 'moment';

/**
 * This renders the article details screen, so when you press on an article of interest in directs you
 * here and displays the different fields of the article is the following order: title, author, article
 * date then the actual article content
 */

const ArticleDetailScreen = (props) => {
    const selectedArticle = useSelector(state =>
        state.articles.availableArticles.find(article => article.title === props.route.params.title)
    );
    return (
    <ScrollView>
      <Text style={styles.articleDetails}>{selectedArticle.title}</Text>
      <Text style={styles.articleDetails}>{selectedArticle.author}</Text>
      <Text style={styles.articleDetails}>{moment(selectedArticle.date).format('YYYY-MM-DD')}</Text>
      <Text style={styles.description}>{selectedArticle.description}</Text>
    </ScrollView>
  );
   

};

export const screenOptions = navData => {
    return {
      headerTitle: 'Article Details'
    };
};
  
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  articleDetails: {
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 20,
    fontFamily: 'open-sans-bold'
  },
  description: {
    fontFamily: 'open-sans',
    fontSize: 14,
    textAlign: 'center',
    marginHorizontal: 20
  }
  
});
  
export default ArticleDetailScreen;