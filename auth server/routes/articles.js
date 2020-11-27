const router = require('express').Router();
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

/**
 * Finds all the articles in the articles collection in the database
 */

router.route('/').get((req, res) => {
    Article.find()
    .then(articles => res.json(articles))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;