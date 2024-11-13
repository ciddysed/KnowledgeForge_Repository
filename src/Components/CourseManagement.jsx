import React, { useEffect, useState } from 'react';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    courseID: '', // Added field for courseID
    courseName: '',
    tutorId: '',
  });
  const [editingCourse, setEditingCourse] = useState(null);

  // Fetch all courses when the component loads
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8080/Course/getCourse');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCourse
      ? `http://localhost:8080/Course/updateCourse/${editingCourse.courseID}`
      : 'http://localhost:8080/Course/addCourses'; // Adjusted URL for adding courses

    const method = editingCourse ? 'PUT' : 'POST'; // Use PUT for update, POST for create

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save course');
      }

      const updatedCourse = await response.json();

      // Update the course list after saving (either creating or updating)
      if (editingCourse) {
        setCourses(
          courses.map((course) =>
            course.courseID === updatedCourse.courseID ? updatedCourse : course
          )
        );
      } else {
        setCourses([...courses, updatedCourse]);
      }

      // Reset form after submission
      setFormData({ courseID: '', courseName: '', tutorId: '' });
      setEditingCourse(null);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleEdit = (course) => {
    setFormData({ courseID: course.courseID, courseName: course.courseName, tutorId: course.tutorId });
    setEditingCourse(course);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/Course/deleteCourse/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setCourses(courses.filter((course) => course.courseID !== id));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="course-management-container">
      <h2>Course Management</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="courseID">Course ID:</label>
          <input
            type="number"
            id="courseID"
            name="courseID"
            value={formData.courseID}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseName">Course Name:</label>
          <input
            type="text"
            id="courseName"
            name="courseName"
            value={formData.courseName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tutorId">Tutor ID:</label>
          <input
            type="text"
            id="tutorId"
            name="tutorId"
            value={formData.tutorId}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="primary-button">
          {editingCourse ? 'Update Course' : 'Add Course'}
        </button>
      </form>

      <div className="course-list">
        <h3>Course List</h3>
        {courses.length === 0 ? (
          <p>No courses available</p>
        ) : (
          <ul>
            {courses.map((course) => (
              <li key={course.courseID}>
                <strong>{course.courseName}</strong> (Tutor ID: {course.tutorId})
                <button onClick={() => handleEdit(course)} className="edit-button">
                  Edit
                </button>
                <button onClick={() => handleDelete(course.courseID)} className="delete-button">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
