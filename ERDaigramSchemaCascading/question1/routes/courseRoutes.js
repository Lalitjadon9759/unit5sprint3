const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

router.post("/courses", courseController.createCourse);
router.delete("/courses/:id", courseController.deleteCourse);
router.get("/courses/:id/students", courseController.getCourseStudents);

module.exports = router;
