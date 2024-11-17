import React, { useEffect, useState } from "react";

const TutorSearch = () => {
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    // Fetch tutors from the backend
    fetch("http://localhost:8080/api/tutors")
      .then((response) => response.json())
      .then((data) => setTutors(data))
      .catch((error) => console.error("Error fetching tutors:", error));
  }, []);

  const handleChoose = (tutor) => {
    const confirmation = window.confirm(
      `Are you sure you want to select ${tutor.tutorName} as your tutor?`
    );
    if (confirmation) {
      setSelectedTutor(tutor);
      alert(
        `Wonderful choice! You have successfully chosen ${tutor.tutorName} as your tutor.`
      );
    } else {
      alert("No worries! Feel free to browse more amazing tutors.");
    }
  };

  // Inline styles for improved single-column layout and design
  const styles = {
    container: {
      padding: "20px",
      maxWidth: "800px",
      margin: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: "#f9f9f9",
    },
    heading: {
      textAlign: "center",
      marginBottom: "25px",
      fontSize: "2rem",
      color: "#3f51b5",
    },
    list: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      alignItems: "center",
    },
    card: {
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "20px",
      width: "100%",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s, box-shadow 0.3s",
      backgroundColor: "#fff",
    },
    cardHover: {
      transform: "translateY(-8px)",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
    },
    cardHeading: {
      fontSize: "1.8rem",
      marginBottom: "12px",
      color: "#1e88e5",
    },
    cardText: {
      fontSize: "1rem",
      color: "#555",
      marginBottom: "10px",
    },
    button: {
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#1e88e5",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "background-color 0.3s",
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
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
      zIndex: 1000,
      maxWidth: "500px",
      width: "90%",
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
      marginTop: "20px",
      padding: "8px 16px",
      border: "none",
      borderRadius: "5px",
      backgroundColor: "#e53935",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Available Tutors</h1>
      <div style={styles.list}>
        {tutors.map((tutor) => (
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
            <p style={styles.cardText}><strong>Username:</strong> {tutor.username}</p>
            <p style={styles.cardText}><strong>Course Major:</strong> {tutor.courseMajor}</p>
            <p style={styles.cardText}><strong>City:</strong> {tutor.city}</p>
            <p style={styles.cardText}><strong>Age:</strong> {tutor.age}</p>
            <p style={styles.cardText}><strong>Degrees:</strong> {tutor.degrees}</p>
            <button
              style={styles.button}
              onClick={() => handleChoose(tutor)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e88e5")}
            >
              Choose
            </button>
          </div>
        ))}
      </div>

      {selectedTutor && (
        <>
          <div style={styles.overlay}></div>
          <div style={styles.modal}>
            <h2 style={styles.cardHeading}>{selectedTutor.tutorName}</h2>
            <p style={styles.cardText}><strong>Email:</strong> {selectedTutor.email}</p>
            <p style={styles.cardText}><strong>Username:</strong> {selectedTutor.username}</p>
            <p style={styles.cardText}><strong>Course Major:</strong> {selectedTutor.courseMajor}</p>
            <p style={styles.cardText}><strong>City:</strong> {selectedTutor.city}</p>
            <p style={styles.cardText}><strong>Age:</strong> {selectedTutor.age}</p>
            <p style={styles.cardText}><strong>Degrees:</strong> {selectedTutor.degrees}</p>
            <button
              style={styles.closeButton}
              onClick={() => setSelectedTutor(null)}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TutorSearch;
