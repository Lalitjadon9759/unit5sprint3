const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  _id: String,
  userId: String,
  movieId: String,
  bookingDate: Date,
  seats: Number,
  status: String, // "Booked", "Cancelled"
});

module.exports = mongoose.model('Booking', bookingSchema);
