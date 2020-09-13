const router = require('express').Router();
const mongoose = require('mongoose');
const Event = mongoose.model('Event');

router.route('/').get((req, res) => {
    Event.find()
    .then(events => res.json(events))
    .catch(err => res.status(400).json('Error: ' + err));
});

// router.route('/:service').get((req, res) => {
//     //console.log(req.params);
//     //const {service} = req.params.service;
//     //console.log({service});
//     Booking.findOne(req.params)
//       .then(booking => res.json(booking))
//       .catch(err => res.status(400).json('Error: ' + err));
// });

module.exports = router;