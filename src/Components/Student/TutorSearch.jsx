import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWebSocket, subscribeToTutorAcceptance } from '../WebSocket';
import { Modal, Backdrop, Fade, Button } from '@mui/material'; // Material-UI components for modal and animations
import './TutorSearch.css'; // External CSS file for custom styling

const TutorSearch = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null); // Tutor whose profile is open
  const [confirmationTutor, setConfirmationTutor] = useState(null); // Tutor to confirm selection
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/tutors`);
        setTutors(response.data);
        setFilteredTutors(response.data);
      } catch (error) {
        console.error('Error fetching tutors:', error);
      }
    };

    fetchTutors();

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    if (loggedInUser) {
      connectWebSocket(() => {
        subscribeToTutorAcceptance(loggedInUser.username, (message) => {
          alert(`Your tutor ${message.tutorName} has accepted you.`);
        });
      });
    }
  }, []);

  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);

    setFilteredTutors(
      selected === 'All'
        ? tutors
        : tutors.filter((tutor) => tutor.courseMajor === selected)
    );
  };

  const handleChoose = async () => {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser) {
      alert('Please log in to select a tutor.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:8080/api/notifications/select`, {
        studentUsername: loggedInUser.username,
        tutorUsername: confirmationTutor.username,
        tutorId: confirmationTutor.tutorID,
      });

      alert('Your selection has been saved successfully.');
      setTutors(tutors.filter((t) => t.tutorID !== confirmationTutor.tutorID));
      setFilteredTutors(filteredTutors.filter((t) => t.tutorID !== confirmationTutor.tutorID));
      localStorage.setItem('bookedTutor', JSON.stringify(confirmationTutor));
      setConfirmationTutor(null);
      navigate(`/chat/${loggedInUser.username}`);
    } catch (error) {
      console.error('Error saving tutor selection:', error);
      alert('Failed to save your selection. Please try again.');
    }
  };

  const handleViewProfile = (tutor) => {
    setSelectedTutor(tutor);
  };

  const closeModal = () => {
    setSelectedTutor(null);
  };

  const closeConfirmationModal = () => {
    setConfirmationTutor(null);
  };

  const openConfirmationModal = (tutor) => {
    setConfirmationTutor(tutor);
  };

  const courseMajors = ['All', ...new Set(tutors.map((tutor) => tutor.courseMajor))];

  return (
    <div className="tutor-search-container">
      <h1 className="tutor-search-heading">Available Tutors</h1>
      <div className="filter-container">
        <select value={selectedCourse} onChange={handleCourseChange} className="dropdown">
          {courseMajors.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
      <div className="grid-container">
        {filteredTutors.map((tutor) => (
          <div key={tutor.tutorID} className="card">
            <h2 className="card-heading">{tutor.tutorName}</h2>
            <p className="card-text">
              <strong>Email:</strong> {tutor.email}
            </p>
            <p className="card-text">
              <strong>Course Major:</strong> {tutor.courseMajor}
            </p>
            <p className="card-text">
              <strong>Degrees:</strong> {tutor.degrees}
            </p>
            <div className="card-buttons">
              <button className="button" onClick={() => openConfirmationModal(tutor)}>
                Choose
              </button>
              <button className="button" onClick={() => handleViewProfile(tutor)}>
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedTutor && (
        <Modal
          open={!!selectedTutor}
          onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={!!selectedTutor}>
            <div className="modal">
              <h2>{selectedTutor.tutorName}</h2>
              <p>
                <strong>Email:</strong> {selectedTutor.email}
              </p>
              <p>
                <strong>Course Major:</strong> {selectedTutor.courseMajor}
              </p>
              <p>
                <strong>Degrees:</strong> {selectedTutor.degrees}
              </p>
              <p>
                <strong>Experience:</strong> {selectedTutor.experience}
              </p>
              <p>
                <strong>Bio:</strong> {selectedTutor.bio}
              </p>
              <button className="close-button" onClick={closeModal}>
                Close
              </button>
            </div>
          </Fade>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {confirmationTutor && (
        <Modal
          open={!!confirmationTutor}
          onClose={closeConfirmationModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={!!confirmationTutor}>
            <div className="modal">
              <h2>Confirm Selection</h2>
              <p>
                Are you sure you want to choose <strong>{confirmationTutor.tutorName}</strong> as your tutor?
              </p>
              <div className="modal-buttons">
                <Button variant="contained" color="primary" onClick={handleChoose}>
                  Confirm
                </Button>
                <Button variant="outlined" color="secondary" onClick={closeConfirmationModal}>
                  Cancel
                </Button>
              </div>
            </div>
          </Fade>
        </Modal>
      )}
    </div>
  );
};

export default TutorSearch;
