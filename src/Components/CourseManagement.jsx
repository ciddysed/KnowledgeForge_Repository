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
        // Confirmation prompt before updating
        const isConfirmed = window.confirm("Are you sure you want to update this course?");
        if (!isConfirmed) return;
  
        await axios.put(`http://localhost:8080/Course/updateCourse/${selectedCourse.courseID}`, courseData);
        alert('Course updated successfully');
      } else {
        await axios.post('http://localhost:8080/Course/addCourses', courseData);
        alert('Course added successfully');
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
      alert('An error occurred while saving the course');
    }
  };

  const handleDelete = async (courseID) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this course?");
    if (!isConfirmed) return;
  
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
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#2c3e50' }}>Course Management</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        <input 
          type="text" 
          placeholder="Course Name" 
          value={courseName} 
          onChange={(e) => setCourseName(e.target.value)} 
          required 
          style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
        <select 
          value={tutorID} 
          onChange={(e) => setTutorID(e.target.value)} 
          required
          style={{ padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
        >
          <option value="">Select Tutor</option>
          {tutors.map(tutor => (
            <option key={tutor.tutorID} value={tutor.tutorID}>
              {tutor.tutorName}
            </option>
          ))}
        </select>
        <button 
          type="submit" 
          style={{ padding: '10px', fontSize: '16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {selectedCourse ? "Update Course" : "Add Course"}
        </button>
      </form>

      <h3 style={{ color: '#2c3e50', marginTop: '30px' }}>Course List</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {courses.map((course) => (
          <li 
            key={course.courseID} 
            style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}
          >
            <strong>{course.courseName}</strong> (Tutor: {course.tutor?.tutorName || "N/A"})
            <div style={{ marginTop: '10px' }}>
              <button 
                onClick={() => handleEdit(course)} 
                style={{ padding: '5px 10px', marginRight: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button 
                onClick={() => handleDelete(course.courseID)} 
                style={{ padding: '5px 10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Course;
