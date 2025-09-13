const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

router.post("/students", studentController.createStudent);
router.delete("/students/:id", studentController.deleteStudent);
router.get("/students/:id/courses", studentController.getStudentCourses);

module.exports = router;
