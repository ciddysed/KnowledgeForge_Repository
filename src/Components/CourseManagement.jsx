import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Course() {
  const [courses, setCourses] = useState([]);
  const [tutors, setTutors] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [tutorID, setTutorID] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses and tutors from the API
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:8080/Course/getCourse');
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const fetchTutors = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tutors');
      console.log("Fetched tutors:", response.data); // Log to check if tutors are fetched correctly
      setTutors(response.data);
    } catch (error) {
      console.error("Error fetching tutors:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchTutors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = { courseName, tutor: { tutorID } };
    
    try {
      if (selectedCourse) {
        await axios.put(`http://localhost:8080/Course/updateCourse/${selectedCourse.courseID}`, courseData);
      } else {
        try {
          await axios.post('http://localhost:8080/Course/addCourses', courseData);
          alert('Adding Course Successful');
        } catch (error) {
          alert('TutorID does not Exist');
        }
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  const handleDelete = async (courseID) => {
    try {
      await axios.delete(`http://localhost:8080/Course/deleteCourse/${courseID}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const handleEdit = (course) => {
    setSelectedCourse(course);
    setCourseName(course.courseName);
    setTutorID(course.tutor?.tutorID || ''); // Safely access nested tutorID
  };

  const resetForm = () => {
    setSelectedCourse(null);
    setCourseName('');
    setTutorID('');
  };

  return (
    <div>
      <h2>Course Management</h2>
      
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Course Name" 
          value={courseName} 
          onChange={(e) => setCourseName(e.target.value)} 
          required 
        />
        <select 
          value={tutorID} 
          onChange={(e) => setTutorID(e.target.value)} 
          required
        >
          <option value="">Select Tutor ID</option>
          {tutors.map(tutor => (
            <option key={tutor.tutorID} value={tutor.tutorID}>
              {tutor.tutorID}
            </option>
          ))}
        </select>
        <button type="submit">{selectedCourse ? "Update Course" : "Add Course"}</button>
      </form>

      <h3>Course List</h3>
      <ul>
        {courses.map((course) => (
          <li key={course.courseID}>
            {course.courseName} (Tutor ID: {course.tutor?.tutorID || "N/A"})
            <button onClick={() => handleEdit(course)}>Edit</button>
            <button onClick={() => handleDelete(course.courseID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Course;
