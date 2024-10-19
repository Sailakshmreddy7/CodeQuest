import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { Form, Button, Container } from "react-bootstrap";
import Sidebar from "./StudentSideBar";
import QuickMenu from "./QuickMenu";
import NotificationToast from "../../components/NotificationToast";

const FeedbackForm = () => {
  const [facultyId, setFacultyId] = useState("");
  const [facultyName, setFacultyName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [student, setStudent] = useState({});

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleFacultyChange = (e) => {
    const selectedFacultyId = e.target.value;
    setFacultyId(selectedFacultyId);

    // Find the corresponding faculty name from the faculties array
    const selectedFaculty = faculties.find(
      (faculty) => faculty.value === selectedFacultyId
    );
    if (selectedFaculty) {
      setFacultyName(selectedFaculty.label);
    }
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };
  console.log("f a ", facultyId);
  console.log("fn ", facultyName);
  console.log("ms ", feedback);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission, e.g., send feedback to a server
    setLoading(true);
    const studentName = student.name;
    const response = await fetch("http://localhost:5173/api/feedback/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ facultyId, facultyName, feedback, studentName }),
    });
    setLoading(false);
    if (response.status === 401) {
      setMessage("Invalid email or password");
      handleShowToast();
      return;
    } else if (!response.ok) {
      setMessage("Somethingh went wrong from our side!");
      handleShowToast();
      return;
    }
    // Reset form after submission
    setMessage("Feedback Sent Successfully");
    handleShowToast();
    setFacultyId("");
    setFacultyName("");
    setFeedback("");
  };

  useEffect(() => {
    fetch("http://localhost:5173/api/faculty/")
      .then((response) => response.json())
      .then((data) => {
        // Map to create an array of objects with id and name for Select options
        const facultyOptions = data.map((faculty) => ({
          value: faculty._id,
          label: faculty.name, // Set label to faculty name
        }));
        setFaculties(facultyOptions);
      })
      .catch((error) => console.error("Error fetching faculties:", error));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("jwt");

      if (token) {
        const decodedToken = jwtDecode(token);
        const { id } = decodedToken;
        try {
          const response = await fetch(
            `http://localhost:5173/api/students/${id}`
          );
          if (response.ok) {
            const studentData = await response.json();
            setStudent(studentData);
          } else {
            console.error("Failed to fetch student data");
          }
        } catch (error) {
          setMessage("Somethigh went wrong");
          handleShowToast();
          console.error("Error fetching student data:", error);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="d-flex" style={{ width: "100vw", height: "100vh" }}>
      {/* Sidebar aligned to the left */}
      <div style={{ flex: "0 0 15%", minWidth: "200px" }}>
        <Sidebar />
      </div>

      {/* Main content container */}
      <div
        style={{
          flex: "1",
          display: "flex",
          justifyContent: "center",
          padding: "0 2rem",
        }}
      >
        <Container style={{ maxWidth: "600px" }}>
          <h4 className="m-5 mt-4 mb-1 text-success">Send Feedback</h4>
          <div className="m-4 mb-4 border-bottom border-3 rounded-5" />
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="facultySelect">
              <Form.Label>Select Faculty</Form.Label>
              <Form.Control
                as="select"
                value={facultyId}
                onChange={handleFacultyChange}
              >
                <option value="">Choose a faculty...</option>
                {faculties.map((facultyOption) => (
                  <option key={facultyOption.value} value={facultyOption.value}>
                    {facultyOption.label}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="feedbackText">
              <Form.Label className="mt-3">Write Your Feedback</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter your feedback here"
                value={feedback}
                onChange={handleFeedbackChange}
              />
            </Form.Group>

            <div className="justify-content-center mt-4">
              <Button variant="primary" type="submit">
                Send Feedback
              </Button>
            </div>
          </Form>
        </Container>
      </div>

      {/* QuickMenu aligned to the right */}
      <div
        style={{
          flex: "0 0 15%",
          minWidth: "300px",
          borderLeft: "3px solid",
          paddingLeft: "1rem",
        }}
      >
        <QuickMenu />
      </div>
      <NotificationToast
        show={showToast}
        setShow={setShowToast}
        message={message}
      />
    </div>
  );
};

export default FeedbackForm;
