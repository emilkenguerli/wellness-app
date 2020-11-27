const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * The MongoDB model of the bookings collection
 */

const bookingSchema = new Schema({
    staffId: {type: String, required: true },
    team: {type: String, required: true },
    service: {type: String, required: true},
    start:{type:Date, required:true},
    end:{type:Date, required: true},
    note: { type: String},
    student: {
      name: {type: String},
      studentNumber: {type: String},
      email: {type: String},
      phone: {type:String}
    },
    canceled: {type: Boolean, required: true},
    dna: {type:Boolean, required: true}
  }, {
    timestamps: true,
  })

mongoose.model('Booking', bookingSchema);