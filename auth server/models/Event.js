const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
  eventOwner: { 
    staffId: {type: String , required: true},
    email: {type: String, required: true},
    username:{type:String, required: true}
  },
  title: {type: String, required:true},
  description: { type: String, required: true },
  duration: { type: String, required: true },
  date: { type: Date, required: true },
  venue: {type: String, required: true}
}, {
  timestamps: true,
});

mongoose.model('Event', eventSchema);
