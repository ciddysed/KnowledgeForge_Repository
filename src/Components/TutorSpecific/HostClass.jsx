import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HostClass.css';

const HostClass = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [hostClassID, setHostClassID] = useState('');
  const [classDate, setClassDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
    // Fetch courses for the logged-in tutor
    const fetchCourses = async () => {
      const username = JSON.parse(localStorage.getItem('loggedInUser')).username;
      const response = await fetch(`http://localhost:8080/Course/tutors/${username}/courses`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCourses(data);
    };

    fetchCourses();
  }, [token]);

  const handleCourseChange = async (e) => {
    const courseId = e.target.value;
    setSelectedCourse(courseId);

    // Fetch topics for the selected course
    const username = JSON.parse(localStorage.getItem('loggedInUser')).username;
    const response = await fetch(`http://localhost:8080/api/topics/tutors/${username}/courses/${courseId}/topics`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    setTopics(data);
  };

  const handleHostClass = async (e) => {
    e.preventDefault();
    setError('');

    const tutorId = JSON.parse(localStorage.getItem('loggedInUser')).tutorID;

    try {
      const response = await fetch(`http://localhost:8080/hostclass/tutor/${tutorId}/course/${selectedCourse}/topic/${selectedTopic}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hostClassID, tutorId, courseId: selectedCourse, topicId: selectedTopic, classDate, description }) // Include classDate and description in the request body
      });

      if (response.ok) {
        navigate('/TutorClasses');
      } else {
        const errorData = await response.json();
        setError(`Failed to host class: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error hosting class:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="host-class-container">
      <h1 className="host-class-header">Host a Class</h1>
      {error && <p className="host-class-error">{error}</p>}
      <form onSubmit={handleHostClass} className="host-class-form">
        <div className="host-class-form-group">
          <label className="host-class-label">Host Class ID:</label>
          <input
            type="text"
            value={hostClassID}
            onChange={(e) => setHostClassID(e.target.value)}
            required
            className="host-class-input"
          />
        </div>
        <div className="host-class-form-group">
          <label className="host-class-label">Course:</label>
          <select value={selectedCourse} onChange={handleCourseChange} required className="host-class-select">
            <option value="">Select a course</option>
            {courses.map(course => (
              <option key={course.courseID} value={course.courseID}>{course.courseName}</option>
            ))}
          </select>
        </div>
        <div className="host-class-form-group">
          <label className="host-class-label">Topic:</label>
          <select value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)} required className="host-class-select">
            <option value="">Select a topic</option>
            {topics.map(topic => (
              <option key={topic.topicID} value={topic.topicID}>{topic.topicName}</option>
            ))}
          </select>
        </div>
        <div className="host-class-form-group">
          <label className="host-class-label">Class Date:</label>
          <input
            type="date"
            value={classDate}
            onChange={(e) => setClassDate(e.target.value)}
            required
            className="host-class-input"
          />
        </div>
        <div className="host-class-form-group">
          <label className="host-class-label">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="host-class-input"
          />
        </div>
        <button type="submit" className="host-class-submit">Host Class</button>
      </form>
      <Link to="/TutorClasses" className="view-classes-link">
        <button className="view-classes-button">View Your Classes</button>
      </Link>
    </div>
  );
};

export default HostClass;