import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import Select from "react-select";

function AddCourseModal({ show, handleClose, setMessage, handleShowToast }) {
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]); // State for selected faculties

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFacultyChange = (selectedOptions) => {
    setSelectedFaculties(selectedOptions || []); // Update selected faculties
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setValidated(true);
    setLoading(true);
    const response = await fetch("http://localhost:5173/api/courses/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        faculties: selectedFaculties.map((option) => ({
          id: option.value,
          name: option.label,
        })), // Send faculty objects
      }),
    });
    setLoading(false);

    if (!response.ok) {
      setMessage("Failed to add course");
      handleShowToast();
      handleClose();
      setValidated(false);
    } else {
      setMessage("Course added successfully");
      handleShowToast();
      handleClose();
      setValidated(false);
    }
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

  console.log("se ", selectedFaculties);
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Course</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="px-5 py-4">
          <Form.Group controlId="formBasicName">
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter course name"
              required
              value={name}
              autoFocus
              onChange={handleNameChange}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid course name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formBasicFaculty">
            <Form.Label>Faculty Names</Form.Label>
            <Select
              options={faculties}
              isMulti
              onChange={handleFacultyChange} // Handle faculty selection
              placeholder="Select faculty names"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" type="submit">
            {loading ? <Spinner animation="border" size="sm" /> : "Add Course"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddCourseModal;
