const router = require('express').Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

/**
 * Finds all the events in the events collection in the database
 */

router.route('/').get((req, res) => {
    Event.find()
    .then(events => res.json(events))
    .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;