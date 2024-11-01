import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Course() {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [tutorID, setTutorID] = useState(''); // Add a field for selecting Tutor ID
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Fetch courses from the API
  const fetchCourses = async () => {
    try {
      const response = await axios.get('/Course/getCourse');
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Add or Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = { courseName, tutor: { tutorID } };
    
    try {
      if (selectedCourse) {
        // Update course
        await axios.put(`/Course/updateCourse/${selectedCourse.courseID}`, courseData);
      } else {
        // Add new course
        await axios.post('/Course/addCourses', courseData);
      }
      fetchCourses();
      resetForm();
    } catch (error) {
      console.error("Error saving course:", error);
    }
  };

  // Delete course
  const handleDelete = async (courseID) => {
    try {
      await axios.delete(`/Course/deleteCourse/${courseID}`);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  // Edit course
  const handleEdit = (course) => {
    setSelectedCourse(course);
    setCourseName(course.courseName);
    setTutorID(course.tutor.tutorID);
  };

  // Reset form
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
        <input 
          type="number" 
          placeholder="Tutor ID" 
          value={tutorID} 
          onChange={(e) => setTutorID(e.target.value)} 
          required 
        />
        <button type="submit">{selectedCourse ? "Update Course" : "Add Course"}</button>
      </form>

      <h3>Course List</h3>
      <ul>
        {courses.map((course) => (
          <li key={course.courseID}>
            {course.courseName} (Tutor ID: {course.tutor.tutorID})
            <button onClick={() => handleEdit(course)}>Edit</button>
            <button onClick={() => handleDelete(course.courseID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


export default Course;
