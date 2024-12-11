import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BookedTutors.css"; // Import CSS file

const BookedTutors = () => {
  const [bookedTutors, setBookedTutors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the logged-in student's username from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const studentUsername = loggedInUser?.username;

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

    // Retrieve the selected tutor from localStorage
    const bookedTutor = JSON.parse(localStorage.getItem('bookedTutor'));
    if (bookedTutor) {
      setBookedTutors([bookedTutor]);
    }
  }, []);

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

  const isSentMessage = (message) => {
    // Assuming 'message' has a property 'sentBy' to determine if it's sent or received
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return message.sentBy === loggedInUser.username;
  };

  return (
    <div className="booked-tutors-container">
      <h1>Booked Tutors</h1>
      {bookedTutors.length > 0 ? (
        <ul className="tutors-list">
          {bookedTutors.map((tutor, index) => (
            <li key={index} className="tutor-item">
              <div className={`tutor-info ${isSentMessage(tutor) ? 'sent-message' : 'received-message'}`}>
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
        Back
      </button>
    </div>
  );
};

export default BookedTutors;