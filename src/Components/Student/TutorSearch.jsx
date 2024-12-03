import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { connectWebSocket, sendNotification, subscribeToTutorAcceptance } from '../WebSocket';

// Define subscribeToStudentNotifications
const subscribeToStudentNotifications = (username, callback) => {
  // Implementation of the function
};

const TutorSearch = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/tutors');
        console.log("Fetched tutors:", response.data);
        setTutors(response.data);
        setFilteredTutors(response.data);
      } catch (error) {
        console.error("Error fetching tutors:", error);
      }
    };

    fetchTutors();

    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    connectWebSocket(() => {
      console.log('WebSocket connected, ready to subscribe to notifications');
      subscribeToStudentNotifications(loggedInUser.username, (message) => {
        console.log("Notification received for student:", message);
        alert(`Notification: ${message}`);
      });

      // Subscribe to notifications when a tutor accepts a student
      subscribeToTutorAcceptance(loggedInUser.username, (message) => {
        alert(`Your tutor ${message.tutorName} has accepted you.`);
      });
    });

  }, []);

  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);

    if (selected === "All") {
      setFilteredTutors(tutors);
    } else {
      const filtered = tutors.filter(
        (tutor) => tutor.courseMajor === selected
      );
      setFilteredTutors(filtered);
    }
  };

  const handleChoose = (tutor) => {
    console.log("Selected tutor:", tutor);
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

    if (!loggedInUser || !loggedInUser.username) {
      console.error('No student logged in');
      alert("Please log in to select a tutor.");
      return;
    }

    const studentUsername = loggedInUser.username;

    if (!tutor.username) {
      console.error("No tutor username available for this tutor.");
      alert("This tutor does not have a valid username.");
      return;
    }

    // Prompt for confirmation
    const confirmSelection = window.confirm(`Are you sure you want to choose ${tutor.tutorName} as your tutor?`);
    if (!confirmSelection) {
      return;
    }

    console.log("tutorUsername:", tutor.username);
    sendNotification(tutor.username, { studentUsername, tutorId: tutor.tutorID });

    // Save the student-tutor selection in the database
    axios.post('http://localhost:8080/api/notifications/select', {
      studentUsername,
      tutorUsername: tutor.username,
      tutorId: tutor.tutorID
    })
    .then(response => {
      if (response.status !== 200) {
        console.error("Failed to save your selection. Status code:", response.status);
        alert("Failed to save your selection. Please try again.");
      } else {
        alert("Your selection has been saved successfully.");
        // Remove the chosen tutor from the list
        setTutors(tutors.filter(t => t.tutorID !== tutor.tutorID));
        setFilteredTutors(filteredTutors.filter(t => t.tutorID !== tutor.tutorID));
        // Store the selected tutor in local storage
        localStorage.setItem('bookedTutor', JSON.stringify(tutor));
        // Navigate to the tutor chat page
        navigate(`/chat/${studentUsername}`);
      }
    })
    .catch(error => {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
        alert(`Failed to save your selection. Server responded with status code ${error.response.status}.`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error request data:", error.request);
        alert("Failed to save your selection. No response received from the server.");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
        alert("An error occurred while saving your selection. Please try again.");
      }
      console.error("Error config:", error.config);
    });
  };

  const handleViewProfile = (tutor) => {
    setSelectedTutor(tutor);
  };

  const closeModal = () => {
    setSelectedTutor(null);
  };

  const courseMajors = ["All", ...new Set(tutors.map((tutor) => tutor.courseMajor))];

  const styles = {
    container: {
      padding: "20px",
      maxWidth: "1200px",
      margin: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    heading: {
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "2rem",
      color: "#3f51b5",
    },
    filterContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: "20px",
    },
    dropdown: {
      padding: "10px",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "1px solid #ddd",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "20px",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "15px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#fff",
      transition: "transform 0.3s, box-shadow 0.3s",
    },
    cardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    },
    cardHeading: {
      fontSize: "1.5rem",
      marginBottom: "10px",
      color: "#1e88e5",
      textAlign: "center",
    },
    cardText: {
      fontSize: "0.9rem",
      color: "#555",
      marginBottom: "8px",
    },
    button: {
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#1e88e5",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "10px",
    },
    buttonHover: {
      backgroundColor: "#1565c0",
    },
    modal: {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
      borderRadius: "10px",
      maxWidth: "500px",
      width: "100%",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 999,
    },
    closeButton: {
      backgroundColor: "#f44336",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: "10px",
      cursor: "pointer",
      fontWeight: "bold",
      textAlign: "center",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Available Tutors</h1>

      {/* Dropdown Filter Section */}
      <div style={styles.filterContainer}>
        <select
          value={selectedCourse}
          onChange={handleCourseChange}
          style={styles.dropdown}
        >
          {courseMajors.map((course, index) => (
            <option key={index} value={course}>
              {course}
            </option>
          ))}
        </select>
      </div>

      {/* Tutors Grid */}
      <div style={styles.grid}>
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.tutorID}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = styles.cardHover.transform;
              e.currentTarget.style.boxShadow = styles.cardHover.boxShadow;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
            }}
          >
            <h2 style={styles.cardHeading}>{tutor.tutorName}</h2>
            <p style={styles.cardText}><strong>Email:</strong> {tutor.email}</p>
            <p style={styles.cardText}><strong>Course Major:</strong> {tutor.courseMajor}</p>
            <p style={styles.cardText}><strong>Degrees:</strong> {tutor.degrees}</p>
            <button
              style={styles.button}
              onClick={() => handleChoose(tutor)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e88e5")}
            >
              Choose
            </button>
            <button
              style={styles.button}
              onClick={() => handleViewProfile(tutor)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e88e5")}
            >
              View Profile
            </button>
          </div>
        ))}
      </div>

      {selectedTutor && (
        <>
          <div style={styles.overlay} onClick={closeModal}></div>
          <div style={styles.modal}>
            <h2>{selectedTutor.tutorName}</h2>
            <p><strong>Email:</strong> {selectedTutor.email}</p>
            <p><strong>Course Major:</strong> {selectedTutor.courseMajor}</p>
            <p><strong>Degrees:</strong> {selectedTutor.degrees}</p>
            <p><strong>Experience:</strong> {selectedTutor.experience}</p>
            <p><strong>Bio:</strong> {selectedTutor.bio}</p>
            <button style={styles.closeButton} onClick={closeModal}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TutorSearch;