const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cast: [{
    name: String,
    email: String,
    phone: String,
    place: String
  }]
});

module.exports = mongoose.model('Movie', movieSchema);
