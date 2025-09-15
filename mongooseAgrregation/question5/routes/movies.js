const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

router.post('/movies', async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(200).json({ message: "Movie created successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
