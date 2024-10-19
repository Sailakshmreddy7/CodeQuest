const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  facultyId: {
    type: String,
    // ref: 'Faculty', // Assuming you have a separate Faculty model, adjust this if necessary
    required: true,
  },
  facultyName: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
