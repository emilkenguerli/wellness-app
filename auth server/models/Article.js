const mongoose = require('mongoose');

const Schema = mongoose.Schema;

/**
 * The MongoDB model of the articles collection
 */

const articleSchema = new Schema({
  articleOwner: { 
    staffId: {type: String , required: true},
    email: {type: String, required: true},
    username:{type:String, required: true}
  },
  title: {type: String, required:true},
  description: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: Date, required: true },
}, {
  timestamps: true,
});

mongoose.model('Article', articleSchema);