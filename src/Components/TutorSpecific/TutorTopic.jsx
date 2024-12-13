import React, { useEffect, useState } from 'react';

const TutorTopic = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
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
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchTopics = async (courseID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/topics/tutors/${username}/courses/${courseID}/topics`);
      const data = await response.json();
      setTopics(Array.isArray(data) ? data : []);
      setSelectedCourse(courseID);
      setIsTopicModalOpen(true);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleAddTopic = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/topics/tutors/${username}/courses/${selectedCourse}/topics`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicName, description: topicDescription }),
        }
      );
      if (response.ok) {
        setTopicName('');
        setTopicDescription('');
        setIsAddModalOpen(false);
        fetchTopics(selectedCourse);
      }
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleDeleteTopic = async (topicID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/topics/tutors/${username}/courses/${selectedCourse}/topics/${topicID}`,
        { method: 'DELETE' }
      );
      if (response.ok) fetchTopics(selectedCourse);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleEditTopic = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/topics/tutors/${username}/courses/${selectedCourse}/topics/${selectedTopic.topicID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicName, description: topicDescription }),
        }
      );
      if (response.ok) {
        setTopicName('');
        setTopicDescription('');
        setIsEditModalOpen(false);
        fetchTopics(selectedCourse);
      }
    } catch (error) {
      console.error('Error editing topic:', error);
    }
  };

  return (
    <div className="container">
      <style>
        {`
          .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            font-family: 'Arial', sans-serif;
            background color: rgba(0, 0, 0, 0.1);
            border-radius: 25px;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.6);
          }
          .header {
            text-align: center;
            color: #000000;
            margin-bottom: 20px;
            font-size: 24px;
          }
          .courseList {
            list-style-type: none;
            padding-left: 0;
          }
          .courseItem {
            padding: 10px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: rgba(255, 255, 255, 0.9);
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: transform 0.3s;
          }
          .courseItem:hover {
            transform: scale(1.02);
          }
          .courseName {
            font-weight: bold;
          }
          .buttonContainer {
            display: flex;
            gap: 10px;
          }
          .button {
            padding: 10px 20px;
            background-color: #3498db;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s, transform 0.3s;
          }
          .button:hover {
            background-color: #2980b9;
            transform: scale(1.05);
          }
          .deleteButton {
            background-color: #e74c3c;
          }
          .deleteButton:hover {
            background-color: #c0392b;
          }
          .modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            width: 80%;
            max-width: 500px;
            transition: transform 0.3s ease-in-out;
          }
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 999;
          }
          .modalHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .modalTitle {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
          }
          .closeButton {
            background: transparent;
            border: none;
            font-size: 18px;
            cursor: pointer;
            color: #7f8c8d;
          }
          .modalBody {
            margin-bottom: 20px;
            font-size: 16px;
            color: #34495e;
          }
          .modalFooter {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }
          .actionButton {
            padding: 10px 20px;
            background-color: #3498db;
            color: #ffffff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background-color 0.3s, transform 0.3s;
          }
          .actionButton:hover {
            background-color: #2980b9;
            transform: scale(1.05);
          }
          .input {
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid #ddd;
            width: 100%;
          }
          .topicContainer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .topicButtons {
            display: flex;
            gap: 10px;
          }
        `}
      </style>
      <h1 className="header">Manage Your Topics</h1>
      <h3 className="header">Your Courses</h3>
      <ul className="courseList">
        {courses.map((course) => (
          <li key={course.courseID} className="courseItem">
            <span className="courseName">{course.courseName}</span>
            <div className="buttonContainer">
              <button className="button" onClick={() => fetchTopics(course.courseID)}>View Topics</button>
              <button className="button" onClick={() => { setSelectedCourse(course.courseID); setIsAddModalOpen(true); }}>Add Topic</button>
            </div>
          </li>
        ))}
      </ul>

      {isTopicModalOpen && (
        <>
          <div className="overlay" onClick={() => setIsTopicModalOpen(false)} />
          <div className="modal">
            <div className="modalHeader">
              <h2 className="modalTitle">Topics</h2>
              <button className="closeButton" onClick={() => setIsTopicModalOpen(false)}>✖</button>
            </div>
            <div className="modalBody">
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <div key={topic.topicID} className="topicContainer">
                    <span>
                      <strong>{topic.topicName}</strong>: {topic.description}
                    </span>
                    <div className="topicButtons">
                      <button className="button" onClick={() => { setSelectedTopic(topic); setTopicName(topic.topicName); setTopicDescription(topic.description); setIsEditModalOpen(true); }}>Edit</button>
                      <button className="button deleteButton" onClick={() => handleDeleteTopic(topic.topicID)}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No topics found for this course.</p>
              )}
            </div>
          </div>
        </>
      )}

      {isAddModalOpen && (
        <>
          <div className="overlay" onClick={() => setIsAddModalOpen(false)} />
          <div className="modal">
            <div className="modalHeader">
              <h2 className="modalTitle">Add Topic</h2>
              <button className="closeButton" onClick={() => setIsAddModalOpen(false)}>✖</button>
            </div>
            <div className="modalBody">
              <input className="input" value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic Name" />
              <textarea className="input" value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} placeholder="Topic Description" />
            </div>
            <div className="modalFooter">
              <button className="actionButton" onClick={handleAddTopic}>Add Topic</button>
            </div>
          </div>
        </>
      )}

      {isEditModalOpen && (
        <>
          <div className="overlay" onClick={() => setIsEditModalOpen(false)} />
          <div className="modal">
            <div className="modalHeader">
              <h2 className="modalTitle">Edit Topic</h2>
              <button className="closeButton" onClick={() => setIsEditModalOpen(false)}>✖</button>
            </div>
            <div className="modalBody">
              <input className="input" value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic Name" />
              <textarea className="input" value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} placeholder="Topic Description" />
            </div>
            <div className="modalFooter">
              <button className="actionButton" onClick={handleEditTopic}>Save Changes</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TutorTopic;
