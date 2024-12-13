import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const HostClass = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [classDate, setClassDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('jwtToken');

  useEffect(() => {
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
        body: JSON.stringify({ tutorId, courseId: selectedCourse, topicId: selectedTopic, classDate, description })
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
      <style>
        {`
          .host-class-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: rgba(255, 255, 255, 0);
            border-radius: 25px;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.6);
            position: relative;
          }

          .host-class-header {
            text-align: center;
            color: #000000;
            font-size: 3rem;
            margin-bottom: 20px;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
          }

          .host-class-form {
            display: flex;
            flex-direction: column;
          }

          .host-class-form-group {
            margin-bottom: 20px;
          }

          .host-class-label {
            font-size: 1.4rem;
            margin-bottom: 8px;
            color: #000000;
            font-weight: bold;
          }

          .host-class-input,
          .host-class-select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 1.1rem;
            transition: border-color 0.3s ease, box-shadow 0.3s ease;
          }

          .host-class-input:focus,
          .host-class-select:focus {
            border-color: #4CAF50;
            box-shadow: 0 0 8px rgba(76, 175, 80, 0.3);
          }

          .host-class-submit {
            padding: 12px 24px;
            background: linear-gradient(135deg, #4CAF50, #388E3C);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.3rem;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }

          .host-class-submit:hover {
            background: linear-gradient(135deg, #45a049, #2e7d32);
            transform: translateY(-2px);
          }

          .view-classes-link {
            display: flex;
            justify-content: center;
            margin-top: 20px;
          }

          .view-classes-button {
            padding: 12px 24px;
            background: linear-gradient(135deg, #007BFF, #0056b3);
            color: white;
            display: flex;
            border: none;
            border-radius: 6px;
            font-size: 1.3rem;
            cursor: pointer;
            transition: background 0.3s ease, transform 0.3s ease;
          }

          .view-classes-button:hover {
            background: linear-gradient(135deg, #0056b3, #004494);
            transform: translateY(-2px);
          }

          .login-tutor-error {
            color: #e74c3c;
            text-align: center;
            margin-bottom: 20px;
          }

          .error-message,
          .success-message {
            text-align: center;
            font-size: 1.1rem;
            padding: 12px;
            margin-bottom: 20px;
            border-radius: 6px;
          }

          .error-message {
            color: #e74c3c;
            background-color: #f9d6d5;
          }

          .success-message {
            color: #2ecc71;
            background-color: #d5f9d6;
          }

          .hosted-classes {
            margin-top: 40px;
          }

          .classes-list {
            list-style-type: none;
            padding: 0;
          }

          .class-item {
            background-color: #fff;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .class-item:hover {
            transform: translateY(-4px);
          }

          .class-item strong {
            display: inline-block;
            margin-bottom: 8px;
          }

          .class-item p {
            margin: 8px 0;
          }
        `}
      </style>
      <h1 className="host-class-header">Host a Class</h1>
      {error && <p className="host-class-error">{error}</p>}
      <form onSubmit={handleHostClass} className="host-class-form">
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