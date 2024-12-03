import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TutorProfile = () => {
  const { id } = useParams(); // Retrieve the tutorID from the URL
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    // Fetch tutor details from the backend
    fetch(`http://localhost:8080/api/tutors/${id}`)
      .then((response) => response.json())
      .then((data) => setTutor(data))
      .catch((error) => console.error("Error fetching tutor details:", error));
  }, [id]);

  if (!tutor) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>{tutor.tutorName}'s Profile</h1>
      <p><strong>Email:</strong> {tutor.email}</p>
      <p><strong>Course Major:</strong> {tutor.courseMajor}</p>
      <p><strong>Degrees:</strong> {tutor.degrees}</p>
      {/* Add more details if needed */}
    </div>
  );
};

export default TutorProfile;
