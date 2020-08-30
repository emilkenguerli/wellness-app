const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
  service:{
        type:String,
        unique:true,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    times:{
        type:Array,
        required:true
    }
}, {
  timestamps: true,
});

mongoose.model('Booking', bookingSchema);