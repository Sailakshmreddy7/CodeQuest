const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  attendance: { type: Number, default: 0 },
  selectedTheoryCourses: [
    {
      course: { type: String, required: true }, // or ObjectId if referencing another model
      faculty: { type: String, required: true }, // or ObjectId if referencing another model
    },
  ],
  selectedLabCourses: [
    {
      course: { type: String, required: true }, // or ObjectId if referencing another model
      faculty: { type: String, required: true }, // or ObjectId if referencing another model
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
