const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const User = require('../models/user');
const Movie = require('../models/movie');

router.post('/bookings', async (req, res) => {
  try {
    const { userId, movieId } = req.body;

    const user = await User.findById(userId);
    const movie = await Movie.findById(movieId);

    if (!user || !movie) {
      return res.status(400).json({ error: "Invalid userId or movieId" });
    }

    const booking = new Booking(req.body);
    await booking.save();
    res.status(200).json({ message: "Booking created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
