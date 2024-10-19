import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import { Card, Form, Button, Modal } from "react-bootstrap";
import QuickMenu from "./QuickMenu";
import Sidebar from "./StudentSideBar";
import NotificationToast from "../NotificationToast";

const CourseSelection = () => {
  const [student, setStudent] = useState([]);
  const [theoryCourses, setTheoryCourses] = useState([]);
  const [labCourses, setLabCourses] = useState([]);
  const [selectedTheoryCourses, setSelectedTheoryCourses] = useState(
    Array(4)
      .fill(null)
      .map(() => ({ course: "", faculty: "" }))
  );
  const [selectedLabCourses, setSelectedLabCourses] = useState(
    Array(2)
      .fill(null)
      .map(() => ({ course: "", faculty: "" }))
  );
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");

  const handleShowToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleTheoryChange = (index, type, value) => {
    const updatedCourses = [...selectedTheoryCourses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [type]: value,
    };
    setSelectedTheoryCourses(updatedCourses);
  };

  console.log("seT ", selectedTheoryCourses);
  console.log("seL ", selectedLabCourses);
  const handleLabChange = (index, type, value) => {
    const updatedCourses = [...selectedLabCourses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [type]: value,
    };
    setSelectedLabCourses(updatedCourses);
  };

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

  const handleSubmit = async () => {
    const allFieldsFilled =
      selectedTheoryCourses.every(({ course, faculty }) => course && faculty) &&
      selectedLabCourses.every(({ course, faculty }) => course && faculty);

    if (!allFieldsFilled) {
      setShowModal(true);
    } else {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5173/api/students/${student._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedTheoryCourses, selectedLabCourses }),
        }
      );
      setLoading(false);
      if (!response.ok) {
        setMessage("Somethingh went wrong");
        handleShowToast();
      } else {
        setMessage("Profile updated successfully");
        handleShowToast();
      }
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5173/api/courses");
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data = await response.json();

        // Categorize courses
        const theory = data.filter(
          (item) => !item.name.toLowerCase().includes("lab")
        );
        const lab = data.filter((item) =>
          item.name.toLowerCase().includes("lab")
        );

        setTheoryCourses(theory);
        setLabCourses(lab);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="d-flex">
      <div>
        <Sidebar />
      </div>

      <div className="mt-5 flex-grow-1">
        <h4 className="m-5 mt-4 mb-1 text-success">Course Selection</h4>
        <div className="m-4 mb-4 border-bottom border-3 rounded-5" />
        <Card className="mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Card.Header>Theory Courses</Card.Header>
          <Card.Body>
            <div className="row">
              {selectedTheoryCourses.map((_, index) => (
                <div key={index} className="col-6 mb-3">
                  <Card
                    className="mx-2"
                    style={{ padding: "1rem", border: "1px solid #dee2e6" }}
                  >
                    <Form.Group>
                      <Form.Label>Select Course</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          handleTheoryChange(index, "course", e.target.value)
                        }
                        value={selectedTheoryCourses[index].course}
                      >
                        <option value="">Select a course</option>
                        {theoryCourses.map((course) => (
                          <option
                            key={course.name}
                            value={course.name}
                            disabled={selectedTheoryCourses.some(
                              (c) => c.course === course.name
                            )}
                          >
                            {course.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <div className="mt-2"></div>
                      <Form.Label>Select Faculty</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          handleTheoryChange(index, "faculty", e.target.value)
                        }
                        value={selectedTheoryCourses[index].faculty}
                        disabled={!selectedTheoryCourses[index].course}
                      >
                        <option value="">Select a faculty</option>
                        {selectedTheoryCourses[index].course &&
                          theoryCourses
                            .find(
                              (course) =>
                                course.name ===
                                selectedTheoryCourses[index].course
                            )
                            ?.faculties.map((faculty) => (
                              <option key={faculty.id} value={faculty.name}>
                                {faculty.name}
                              </option>
                            ))}
                      </Form.Select>
                    </Form.Group>
                  </Card>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <Card className="mb-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
          <Card.Header>Lab Courses</Card.Header>
          <Card.Body>
            <div className="row">
              {selectedLabCourses.map((_, index) => (
                <div key={index} className="col-6 mb-3">
                  <Card
                    className="mx-2"
                    style={{ padding: "1rem", border: "1px solid #dee2e6" }}
                  >
                    <Form.Group>
                      <Form.Label>Select Course</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          handleLabChange(index, "course", e.target.value)
                        }
                        value={selectedLabCourses[index].course}
                      >
                        <option value="">Select a course</option>
                        {labCourses.map((course) => (
                          <option
                            key={course.name}
                            value={course.name}
                            disabled={selectedLabCourses.some(
                              (c) => c.course === course.name
                            )}
                          >
                            {course.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                    <Form.Group>
                      <div className="mt-2"></div>
                      <Form.Label>Select Faculty</Form.Label>
                      <Form.Select
                        onChange={(e) =>
                          handleLabChange(index, "faculty", e.target.value)
                        }
                        value={selectedLabCourses[index].faculty}
                        disabled={!selectedLabCourses[index].course}
                      >
                        <option value="">Select a faculty</option>
                        {selectedLabCourses[index].course &&
                          labCourses
                            .find(
                              (course) =>
                                course.name === selectedLabCourses[index].course
                            )
                            ?.faculties.map((faculty) => (
                              <option key={faculty.id} value={faculty.name}>
                                {faculty.name}
                              </option>
                            ))}
                      </Form.Select>
                    </Form.Group>
                  </Card>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        <div className="d-flex justify-content-end mt-4">
          <Button
            className="me-3"
            onClick={handleSubmit}
            disabled={
              !selectedTheoryCourses.every(
                ({ course, faculty }) => course && faculty
              ) ||
              !selectedLabCourses.every(
                ({ course, faculty }) => course && faculty
              )
            }
          >
            Submit
          </Button>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Warning</Modal.Title>
          </Modal.Header>
          <Modal.Body>Please select all fields from all courses.</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div
        className="flex-grow-1 border-start border-3"
        style={{ width: "5rem" }}
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

export default CourseSelection;
