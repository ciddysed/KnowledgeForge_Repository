import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookedTutors = ({ studentUsername }) => {
  const [bookedTutors, setBookedTutors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch booked tutors data for the specific student
    const fetchBookedTutors = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notifications/student/${studentUsername}`);
        setBookedTutors(response.data);
      } catch (error) {
        console.error("Error fetching booked tutors:", error);
      }
    };

    if (studentUsername) {
      fetchBookedTutors();
    }

    // Retrieve the selected tutor from local storage
    const bookedTutor = JSON.parse(localStorage.getItem('bookedTutor'));
    if (bookedTutor) {
      setBookedTutors([bookedTutor]);
    }
  }, [studentUsername]);

  const handleBack = () => {
    navigate("/studentHome");
  };

  return (
    <div className="booked-tutors-container">
      <h1>Booked Tutors</h1>
      {bookedTutors.length > 0 ? (
        <ul>
          {bookedTutors.map((tutor, index) => (
            <li key={index}>
              <strong>Tutor Name:</strong> {tutor.tutorUsername} <br />
              <strong>Details:</strong> Tutor ID: {tutor.tutorId}
            </li>
          ))}
        </ul>
      ) : (
        <p>No tutors booked yet.</p>
      )}
      <button
        onClick={handleBack}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3498db",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default BookedTutors;
