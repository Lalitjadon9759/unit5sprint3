const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const moviesRoute = require('./routes/movies');
const usersRoute = require('./routes/users');
const bookingsRoute = require('./routes/bookings');
const analyticsRoute = require('./routes/analytics');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/movieBooking', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

app.use('/', moviesRoute);
app.use('/', usersRoute);
app.use('/', bookingsRoute);
app.use('/', analyticsRoute);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
