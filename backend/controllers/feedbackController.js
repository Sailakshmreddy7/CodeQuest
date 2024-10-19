const Feedback = require("../models/Feedback"); // Adjust the path as necessary

exports.createFeedback = async (req, res) => {
  try {
    const { facultyId, facultyName, feedback, studentName } = req.body;

    // Create a new Feedback instance
    const newFeedback = new Feedback({
      facultyId,
      facultyName,
      feedback,
      studentName,
    });

    // Save the feedback to the database
    await newFeedback.save();

    // Respond with a success message
    res.status(201).json({
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    // Handle any errors
    res.status(400).json({ error: error.message });
  }
};

exports.getFeedback = async (req, res) => {
  try {
    // Retrieve all feedback from the database
    const feedbacks = await Feedback.find();

    // Respond with the retrieved feedbacks
    res.status(200).json(feedbacks);
  } catch (error) {
    // Handle any errors
    res.status(400).json({ error: error.message });
  }
};
