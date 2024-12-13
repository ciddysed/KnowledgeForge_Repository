import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

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
        const tutorsData = response.data.map(tutor => ({
          tutorName: tutor.tutor.tutorName || tutor.tutor.username, // Ensure correct field is used
          tutorId: tutor.tutorId || tutor.tutor.tutorID, // Ensure correct field is used
          // Add other necessary fields here
        }));
        setBookedTutors(tutorsData);
      } catch (error) {
        console.error("Error fetching booked tutors:", error);
      }
    };

    if (studentUsername) {
      fetchBookedTutors();
    }
  }, []);

  const handleConnect = (tutorUsername) => {
    Swal.fire({
      title: 'Do you want to connect with this tutor?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate(`/chat/${tutorUsername}`);
      }
    });
  };

  const handleCancelBooking = async (tutorId) => {
    Swal.fire({
      title: 'Are you sure you want to cancel this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/notifications/cancel/${tutorId}`);
          setBookedTutors(bookedTutors.filter(tutor => tutor.tutorId !== tutorId));
          Swal.fire('Cancelled!', 'Your booking has been cancelled.', 'success');
        } catch (error) {
          console.error("Error canceling booking:", error);
          Swal.fire('Error!', 'There was an error cancelling your booking.', 'error');
        }
      }
    });
  };

  const isSentMessage = (message) => {
    // Assuming 'message' has a property 'sentBy' to determine if it's sent or received
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    return message.sentBy === loggedInUser.username;
  };

  return (
    <>
      <style>
        {`
          .booked-tutors-container {
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
            border-radius: 12px;
            font-family: 'Arial', sans-serif;
            margin: 75px auto 0;
            background-color: rgba(28, 126, 224, 0.0);
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.5);
          }

          h1 {
            text-align: center;
            color: #000000;
            font-size: 2.5em;
            margin-bottom: 20px;
          }

          .tutors-list {
            list-style-type: none;
            padding: 0;
          }

          .tutor-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            transition: transform 0.2s;
          }

          .tutor-item:hover {
            transform: translateY(-5px);
          }

          .tutor-info {
            flex: 1;
            font-size: 1.1em;
            color: #34495e;
          }

          .tutor-actions {
            display: flex;
            gap: 15px;
          }

          .connect-button,
          .cancel-button,
          .back-button {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s;
          }

          .connect-button {
            background-color: #27ae60;
            color: white;
          }

          .connect-button:hover {
            background-color: #2ecc71;
          }

          .cancel-button {
            background-color: #c0392b;
            color: white;
          }

          .cancel-button:hover {
            background-color: #e74c3c;
          }

          .back-button {
            display: block;
            margin: 30px auto 0;
            background-color: #2980b9;
            color: white;
          }

          .back-button:hover {
            background-color: #3498db;
          }
        `}
      </style>
      <div className="booked-tutors-container">
        <h1>Booked Tutors</h1>
        {bookedTutors.length > 0 ? (
          <ul className="tutors-list">
            {bookedTutors.map((tutor, index) => (
              <li key={index} className="tutor-item">
                <div className={`tutor-info ${isSentMessage(tutor) ? 'sent-message' : 'received-message'}`}>
                  <strong>Tutor Name:</strong> {tutor.tutorName} <br />
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
      </div>
    </>
  );
};

export default BookedTutors;