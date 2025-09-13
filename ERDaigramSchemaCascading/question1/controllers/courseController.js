const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");

exports.createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new Course({ title, description });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course || !course.isActive)
      return res.status(404).json({ error: "Course not found or already inactive" });

    course.isActive = false;
    await course.save();

    await Enrollment.updateMany({ courseId: course._id }, { isActive: false });

    res.json({ message: "Course and related enrollments soft deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseStudents = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ courseId: req.params.id, isActive: true })
      .populate({
        path: "studentId",
        match: { isActive: true }
      });

    const students = enrollments
      .map(e => e.studentId)
      .filter(student => student !== null);

    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
