const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    starRating: {
        type: Number,
        required: true,
        min: 1,
        max: 5 // Assuming a 5-star rating system
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    
    },
    likes: {
      type: Number,
      default: 0 // Default value set to 0
  },
  dislikes: {
      type: Number,
      default: 0 // Default value set to 0
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
