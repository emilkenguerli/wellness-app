const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const articleSchema = new Schema({
  //userID: {type: String, required:true},
  articleOwner: { 
    staffId: {type: String , required: true},
    email: {type: String, required: true},
    username:{type:String, required: true}
  },
  title: {type: String, required:true},
  description: { type: String, required: true },
  author: { type: String, required: true },
  date: { type: String, required: true },
}, {
  timestamps: true,
});

mongoose.model('Article', articleSchema);