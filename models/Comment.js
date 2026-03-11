const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Please add a comment'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  recipe: {
    type: mongoose.Schema.ObjectId,
    ref: 'Recipe',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Comment', CommentSchema);
