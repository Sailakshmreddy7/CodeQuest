import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

import Sidebar from "./FacultySideBar";
import QuickMenu from "./QuickMenu";
import NotificationToast from "../../components/NotificationToast";

const StudentFeedback = () => {
  const [faculty, setFaculty] = useState({});
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState([]);
  const feedbackData = [
    {
      facultyName: "Dr. Smith",
      feedback: "Great course, very engaging!",
      studentName: "John Doe",
    },
    {
      facultyName: "Prof. Johnson",
      feedback: "Loved the practical approach!",
      studentName: "Jane Smith",
    },
    {
      facultyName: "Dr. Brown",
      feedback: "The assignments were challenging but helpful.",
      studentName: "Emily Johnson",
    },
    // Add more feedback objects as needed
  ];

  console.log("de ", feedback);

  useEffect(() => {
    const token = localStorage.getItem("jwt");

    if (token) {
      const decodedToken = jwtDecode(token);
      const { id } = decodedToken;
      fetch("http://localhost:5173/api/feedback/")
        .then((response) => response.json())
        .then((data) => {
          console.log("datas ", data);
          const filteredFeedbacks = data.filter(
            (item) => item.facultyId === id
          );

          // Update the feedbacks state with the filtered data
          setFeedback(filteredFeedbacks);
        })
        .catch((error) => console.error("Error fetching faculties:", error));
    }
  }, []);

  return (
    <div className="d-flex" style={{ height: "100vh" }}>
      <div style={{ flex: "0 0 200px" }}>
        {" "}
        {/* Fixed width for Sidebar */}
        <Sidebar />
      </div>

      <div className="flex-grow-1">
        <h4 className="m-5 mt-4 mb-1 text-success">Students Feedbacks</h4>
        <div className="m-4 mb-4 border-bottom border-3 rounded-5" />
        <table
          style={{
            width: "100%",
            marginLeft: "10px",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Faculty Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Feedback
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                Student Name
              </th>
            </tr>
          </thead>
          <tbody>
            {feedback.map((feedback, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feedback.facultyName}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feedback.feedback}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {feedback.studentName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          flex: "0 0 300px",
          borderStart: "3px solid",
          marginLeft: "auto",
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

export default StudentFeedback;
