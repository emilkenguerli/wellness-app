const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  //userID: {type: String, required:true},
  username: { type: String},
  title: {type: String, required:true},
  description: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
}, {
  timestamps: true,
});

mongoose.model('Article', articleSchema);