const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
