import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookedTutors.css"; // Import CSS file

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

  const handleConnect = (tutorUsername) => {
    if (window.confirm("Do you want to connect with this tutor?")) {
      navigate(`/chat/${tutorUsername}`);
    }
  };

  const handleCancelBooking = async (tutorId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await axios.delete(`http://localhost:8080/api/notifications/cancel/${tutorId}`);
        setBookedTutors(bookedTutors.filter(tutor => tutor.tutorId !== tutorId));
      } catch (error) {
        console.error("Error canceling booking:", error);
      }
    }
  };

  return (
    <div className="booked-tutors-container">
      <h1>Booked Tutors</h1>
      {bookedTutors.length > 0 ? (
        <ul className="tutors-list">
          {bookedTutors.map((tutor, index) => (
            <li key={index} className="tutor-item">
              <div className="tutor-info">
                <strong>Tutor Name:</strong> {tutor.tutorUsername} <br />
                <strong>Details:</strong> Tutor ID: {tutor.tutorId}
              </div>
              <div className="tutor-actions">
                <button className="connect-button" onClick={() => handleConnect(tutor.tutorUsername)}>Connect</button>
                <button className="cancel-button" onClick={() => handleCancelBooking(tutor.tutorId)}>Cancel Booking</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tutors booked yet.</p>
      )}
      <button className="back-button" onClick={handleBack}>
        Back to Home
      </button>
    </div>
  );
};

export default BookedTutors;
