const express = require("express");
const mongoose = require("mongoose");

const studentRoutes = require("./routes/students");
const courseRoutes = require("./routes/courses");
const enrollmentRoutes = require("./routes/enrollments");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/student_course_m2m", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enroll", enrollmentRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
