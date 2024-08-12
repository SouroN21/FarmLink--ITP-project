const mongoose = require('mongoose');

const expertlistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  expertise: { type: [String], required: true }, // Update expertise to accept an array of strings
  location: { type: String, required: true },
  picture: { type: Object, required: true },
});

const Expertlist = mongoose.model('Expertlist', expertlistSchema);

module.exports = Expertlist;

