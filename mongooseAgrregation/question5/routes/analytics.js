const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const Movie = require('../models/movie');
const User = require('../models/user');

// Route 1: Total bookings and total seats per movie
router.get('/analytics/movie-bookings', async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: "$movieId",
          totalBookings: { $sum: 1 },
          totalSeats: { $sum: "$seats" },
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "_id",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $project: {
          _id: 0,
          movieId: "$_id",
          title: "$movie.title",
          totalBookings: 1,
          totalSeats: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route 2: Booking history for each user with movie titles
router.get('/analytics/user-bookings', async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $group: {
          _id: "$user._id",
          name: { $first: "$user.name" },
          bookings: {
            $push: {
              movieTitle: "$movie.title",
              bookingDate: "$bookingDate",
              seats: "$seats",
              status: "$status",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: 1,
          bookings: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route 3: Top users who booked more than 2 times
router.get('/analytics/top-users', async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $group: {
          _id: "$userId",
          totalBookings: { $sum: 1 },
        },
      },
      { $match: { totalBookings: { $gt: 2 } } },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          totalBookings: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route 4: Total seats booked per genre
router.get('/analytics/genre-wise-bookings', async (req, res) => {
  try {
    const result = await Booking.aggregate([
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $group: {
          _id: "$movie.genre",
          totalSeats: { $sum: "$seats" },
        },
      },
      {
        $project: {
          _id: 0,
          genre: "$_id",
          totalSeats: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route 5: Get all active ("Booked") bookings with details
router.get('/analytics/active-bookings', async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $match: { status: "Booked" } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "movies",
          localField: "movieId",
          foreignField: "_id",
          as: "movie",
        },
      },
      { $unwind: "$movie" },
      {
        $project: {
          _id: 0,
          bookingId: "$_id",
          userName: "$user.name",
          movieTitle: "$movie.title",
          seats: 1,
          bookingDate: 1,
        },
      },
    ]);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
