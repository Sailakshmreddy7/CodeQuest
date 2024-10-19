const mongoose = require("mongoose");

// Define a schema for faculty
const facultySchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Assuming faculty id is an ObjectId
  name: { type: String, required: true },
});

// Define the course schema with the faculties array
const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  faculties: [facultySchema], // Array of faculty objects
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
