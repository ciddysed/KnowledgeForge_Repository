import React, { useEffect, useState } from "react";

const TutorSearch = () => {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    // Fetch tutors from the backend
    fetch("http://localhost:8080/api/tutors")
      .then((response) => response.json())
      .then((data) => {
        setTutors(data);
        setFilteredTutors(data);

        // Extract unique courses for the dropdown
        const uniqueCourses = Array.from(new Set(data.map((tutor) => tutor.courseMajor)));
        setCourses(uniqueCourses);
      })
      .catch((error) => console.error("Error fetching tutors:", error));
  }, []);

  const handleCourseFilter = (event) => {
    const selected = event.target.value;
    setSelectedCourse(selected);

    // Filter tutors by selected course
    if (selected === "") {
      setFilteredTutors(tutors); // Show all tutors if no course is selected
    } else {
      setFilteredTutors(tutors.filter((tutor) => tutor.courseMajor === selected));
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
    dropdown: {
      marginBottom: "20px",
      padding: "10px",
      fontSize: "1rem",
      border: "1px solid #ddd",
      borderRadius: "5px",
      width: "100%",
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
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Available Tutors</h1>
      
      {/* Dropdown to filter tutors by course */}
      <select style={styles.dropdown} value={selectedCourse} onChange={handleCourseFilter}>
        <option value="">Filter by Courses</option>
        {courses.map((course, index) => (
          <option key={index} value={course}>
            {course}
          </option>
        ))}
      </select>

      <div style={styles.list}>
        {filteredTutors.map((tutor) => (
          <div
            key={tutor.tutorID}
            style={styles.card}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-8px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
            }}
          >
            <h2>{tutor.tutorName}</h2>
            <p><strong>Email:</strong> {tutor.email}</p>
            <p><strong>Username:</strong> {tutor.username}</p>
            <p><strong>Course Major:</strong> {tutor.courseMajor}</p>
            <p><strong>City:</strong> {tutor.city}</p>
            <p><strong>Age:</strong> {tutor.age}</p>
            <p><strong>Degrees:</strong> {tutor.degrees}</p>
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
