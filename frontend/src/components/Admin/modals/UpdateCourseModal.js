import React, { useState, useEffect } from "react";
import { Button, Form, Modal, Col, Row, Spinner } from "react-bootstrap";
import Select from "react-select";

function UpdateCourseModal({
  show,
  handleClose,
  course,
  setMessage,
  handleShowToast,
}) {
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState([]);
  const [selectedFaculties, setSelectedFaculties] = useState([]);

  useEffect(() => {
    if (course) {
      setName(course.name || "");
      setSelectedFaculties(
        course.faculties.map((faculty) => ({
          value: faculty.id, // Assuming each faculty has an id property
          label: faculty.name, // Assuming each faculty has a name property
        })) || []
      );
    }
  }, [course]);

  // Fetch faculties on component mount
  useEffect(() => {
    fetch("http://localhost:5173/api/faculty/")
      .then((response) => response.json())
      .then((data) => {
        const facultyOptions = data.map((faculty) => ({
          value: faculty.id,
          label: faculty.name,
        }));
        setFaculties(facultyOptions);
      })
      .catch((error) => console.error("Error fetching faculties:", error));
  }, []);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleFacultyChange = (selectedOptions) => {
    setSelectedFaculties(selectedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
    setLoading(true);
    const response = await fetch(
      `http://localhost:5173/api/courses/${course._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          faculties: selectedFaculties, // Send the full objects for the faculties
        }),
      }
    );
    setLoading(false);

    if (!response.ok) {
      setMessage("Failed to update course");
      handleShowToast();
      handleClose();
      setValidated(false);
    } else {
      setMessage("Course updated successfully");
      handleShowToast();
      handleClose();
      setValidated(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Course</Modal.Title>
      </Modal.Header>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Modal.Body className="px-5 py-4">
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom01">
              <Form.Label>Course Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter course name"
                value={name}
                onChange={handleNameChange}
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="formBasicFaculty">
              <Form.Label>Faculty Names</Form.Label>
              <Select
                options={faculties}
                isMulti
                value={selectedFaculties}
                onChange={handleFacultyChange}
                placeholder="Select faculty names"
              />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" type="submit">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateCourseModal;
