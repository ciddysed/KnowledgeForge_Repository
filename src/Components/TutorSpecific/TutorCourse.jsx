import React, { useEffect, useState } from 'react';

const TutorCourse = () => {
  const [courses, setCourses] = useState([]);
  const [courseName, setCourseName] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsername(userData.username);
      fetchCourses(userData.username);
    }
  }, []);

  const fetchCourses = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/Course/tutors/${username}/courses`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddCourse = async () => {
    try {
      console.log('Adding course:', courseName);
      const response = await fetch(`http://localhost:8080/Course/tutors/${username}/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseName }),
      });
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Course added:', data);
        fetchCourses(username);
        setCourseName('');
      } else {
        const errorData = await response.json();
        console.error('Error adding course:', errorData);
      }
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const handleEdit = async (course) => {
    const newCourseName = prompt('Enter new course name:', course.courseName);
    if (newCourseName) {
      try {
        const response = await fetch(`http://localhost:8080/Course/tutors/${username}/courses/${course.courseID}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseName: newCourseName }),
        });
        if (response.ok) {
          fetchCourses(username);
        } else {
          console.error('Error editing course');
        }
      } catch (error) {
        console.error('Error editing course:', error);
      }
    }
  };

  const handleDelete = async (courseID) => {
    try {
      const response = await fetch(`http://localhost:8080/Course/tutors/${username}/courses/${courseID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCourses(username);
      } else {
        console.error('Error deleting course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div>
      <h1>Manage Your Courses</h1>
      <div>
        <input
          type="text"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
          placeholder="Course Name"
          style={{ padding: '10px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button
          onClick={handleAddCourse}
          style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Add Course
        </button>
      </div>
      <h3 style={{ color: '#2c3e50', marginTop: '30px' }}>Your Courses</h3>
      <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
        {Array.isArray(courses) && courses.map((course) => (
          <li
            key={course.courseID}
            style={{ padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9' }}
          >
            <strong>{course.courseName}</strong>
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
};

export default TutorCourse;