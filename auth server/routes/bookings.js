const router = require('express').Router();
const mongoose = require('mongoose');
const Booking = mongoose.model('Booking');

router.route('/').get((req, res) => {
  Booking.find()
    .then(bookings => res.json(bookings))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:service').get((req, res) => {
    //console.log(req.params);
    //const {service} = req.params.service;
    //console.log({service});
    Booking.findOne(req.params)
      .then(booking => res.json(booking))
      .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;