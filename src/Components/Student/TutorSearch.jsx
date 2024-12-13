import { Backdrop, Button, Fade, Modal } from '@mui/material'; // Material-UI components for modal and animations
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connectWebSocket, subscribeToTutorAcceptance } from '../WebSocket';
import { makeStyles } from '@mui/styles'; // Import makeStyles for styling
import Swal from 'sweetalert2'; // Import SweetAlert2

const useStyles = makeStyles({
  tutorSearchContainer: {
    padding: '20px',
    maxWidth: '1200px',
    margin: 'auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  tutorSearchHeading: {
    textAlign: 'center',
    marginBottom: '25px',
    fontSize: '2.5rem',
    color: '#000000',
  },
  filterContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  dropdown: {
    padding: '10px',
    fontSize: '1rem',
    borderRadius: '5px',
    border: '1px solid #ddd',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    transition: 'transform 0.3s, boxShadow 0.3s',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  cardHeading: {
    fontSize: '1.5rem',
    marginBottom: '10px',
    color: '#1e88e5',
  },
  cardText: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '10px',
  },
  cardButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: 'auto',
  },
  button: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#1e88e5',
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'backgroundColor 0.3s',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '20px',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    width: '90%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#d32f2f',
    },
  },
  profileModalContent: {
    textAlign: 'left',
    '& h2': {
      marginBottom: '15px',
      color: '#3f51b5',
    },
    '& p': {
      marginBottom: '10px',
      fontSize: '1rem',
      color: '#555',
    },
  },
  confirmationModalContent: {
    '& h2': {
      marginBottom: '15px',
      color: '#3f51b5',
    },
    '& p': {
      marginBottom: '20px',
      fontSize: '1rem',
      color: '#555',
    },
  },
});

const TutorSearch = () => {
  const classes = useStyles();
  const [tutors, setTutors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null); // Tutor whose profile is open
  const [confirmationTutor, setConfirmationTutor] = useState(null); // Tutor to confirm selection

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
          Swal.fire({
            title: 'Tutor Accepted',
            text: `Your tutor ${message.tutorName} has accepted you.`,
            icon: 'success',
            confirmButtonText: 'OK'
          });
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
      Swal.fire({
        title: 'Error',
        text: 'Please log in to select a tutor.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      await axios.post(`http://localhost:8080/api/notifications/select`, {
        studentUsername: loggedInUser.username,
        tutorUsername: confirmationTutor.username,
        tutorId: confirmationTutor.tutorID,
      });

      Swal.fire({
        title: 'Success',
        text: 'Your selection has been saved successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      setTutors(tutors.filter((t) => t.tutorID !== confirmationTutor.tutorID));
      setFilteredTutors(filteredTutors.filter((t) => t.tutorID !== confirmationTutor.tutorID));
      localStorage.setItem('bookedTutor', JSON.stringify(confirmationTutor));
      setConfirmationTutor(null);
      // Removed redirection to chat
    } catch (error) {
      console.error('Error saving tutor selection:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save your selection. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
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
    <div className={classes.tutorSearchContainer}>
      <h1 className={classes.tutorSearchHeading}>Available Tutors</h1>
      <div className={classes.filterContainer}>
        <select value={selectedCourse} onChange={handleCourseChange} className={classes.dropdown}>
          {courseMajors.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>
      <div className={classes.gridContainer}>
        {filteredTutors.map((tutor) => (
          <div key={tutor.tutorID} className={classes.card}>
            <h2 className={classes.cardHeading}>{tutor.tutorName}</h2>
            <p className={classes.cardText}>
              <strong>Email:</strong> {tutor.email}
            </p>
            <p className={classes.cardText}>
              <strong>Course Major:</strong> {tutor.courseMajor}
            </p>
            <p className={classes.cardText}>
              <strong>Degrees:</strong> {tutor.degrees}
            </p>
            <div className={classes.cardButtons}>
              <button className={classes.button} onClick={() => openConfirmationModal(tutor)}>
                Choose
              </button>
              <button className={classes.button} onClick={() => handleViewProfile(tutor)}>
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
            <div className={classes.modal}>
              <div className={classes.profileModalContent}>
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
                <button className={classes.closeButton} onClick={closeModal}>
                  Close
                </button>
              </div>
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
            <div className={classes.modal}>
              <div className={classes.confirmationModalContent}>
                <h2>Confirm Selection</h2>
                <p>
                  Are you sure you want to choose <strong>{confirmationTutor.tutorName}</strong> as your tutor?
                </p>
                <div className={classes.modalButtons}>
                  <Button variant="contained" color="primary" onClick={handleChoose}>
                    Confirm
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={closeConfirmationModal}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </Fade>
        </Modal>
      )}
    </div>
  );
};

export default TutorSearch;
