import React, { useState, useEffect } from "react";

const TutorSearch = () => {
  const [tutors, setTutors] = useState([]);
  const [courses, setCourses] = useState({});
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("All");

  useEffect(() => {
    // Fetch tutors from the backend
    fetch("http://localhost:8080/api/tutors")
      .then((response) => response.json())
      .then((data) => {
        setTutors(data);
        setFilteredTutors(data); // Initialize filtered list
        data.forEach((tutor) => fetchCourses(tutor.tutorID)); // Fetch courses for each tutor
      })
      .catch((error) => console.error("Error fetching tutors:", error));
  }, []);

  const fetchCourses = (tutorId) => {
    fetch(`http://localhost:8080/Course/getCourse?tutorId=${tutorId}`)
      .then((response) => response.json())
      .then((data) => {
        // Map courses to the specific tutorID
        setCourses((prevCourses) => ({
          ...prevCourses,
          [tutorId]: data, // Only store courses for this tutor
        }));
      })
      .catch((error) => console.error("Error fetching courses:", error));
  };

  const handleCourseChange = (e) => {
    const selected = e.target.value;
    setSelectedCourse(selected);

    // Filter tutors by selected course
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

  // const handleCloseModal = () => {
  //   setSelectedTutor(null);
  // };

  // Get unique course majors for the dropdown
  const courseMajors = ["All", ...new Set(tutors.map((tutor) => tutor.courseMajor))];

  // Function to generate star ratings based on rating
  // const renderStars = (rating) => {
  //   const filledStars = "★".repeat(rating);
  //   const emptyStars = "☆".repeat(5 - rating);
  //   return filledStars + emptyStars;
  // };

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
          </div>
        ))}
      </div>
    </div>
  );
};

export default TutorSearch;
