import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentClassList = () => {
  const [acceptedClasses, setAcceptedClasses] = useState([]);
  const [error, setError] = useState('');
  const [tutorFilter, setTutorFilter] = useState('');
  const navigate = useNavigate();
  const username = JSON.parse(localStorage.getItem('loggedInUser')).username;

  useEffect(() => {
    const fetchAcceptedClasses = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/notifications/student/${username}`);
        if (response.ok) {
          const classes = await response.json();
          setAcceptedClasses(classes);
        } else {
          setError('Failed to fetch classes.');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchAcceptedClasses();
  }, [username]);

  const handleViewModules = (topicId) => {
    navigate(`/modules/${topicId}`);
  };

  const handleTutorFilterChange = (event) => {
    setTutorFilter(event.target.value);
  };

  const uniqueTutors = [...new Set(acceptedClasses.map((hostClass) => hostClass.tutor?.tutorName).filter(Boolean))];

  const filteredClasses = acceptedClasses.filter((hostClass) =>
    typeof hostClass.tutor?.tutorName === 'string' && hostClass.tutor.tutorName.toLowerCase().includes(tutorFilter.toLowerCase())
  );

  return (
    <>
      <style>
        {`
          .class-list-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 30px;
            background-color: rgba(51, 54, 207, 0);
            border-radius: 12px;
            box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
            margin-top: 50px;
          }
          h1 {
            text-align: center;
            color: #222;
            font-size: 2em;
            margin-bottom: 30px;
          }
          .tutor-filter {
            width: 100%;
            padding: 12px;
            margin-bottom: 25px;
            border: 1px solid #bbb;
            border-radius: 6px;
            font-size: 1em;
          }
          .error-message {
            color: #e74c3c;
            text-align: center;
            font-weight: bold;
          }
          .class-list {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }
          .class-item {
            padding: 20px;
            margin-bottom: 15px;
            background-color: #fff;
            border: 1px solid #ccc;
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            transition: transform 0.3s, box-shadow 0.3s;
          }
          .class-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
          }
          .class-item p {
            margin: 0;
            color: #444;
            font-size: 1em;
          }
          .view-modules-button {
            align-self: flex-start;
            padding: 12px 20px;
            background-color: #3498db;
            color: #fff;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 1em;
            transition: background-color 0.3s;
          }
          .view-modules-button:hover {
            background-color: #2980b9;
          }
        `}
      </style>
      <div className="class-list-container">
        <h1>Active Classes</h1>
        <select className="tutor-filter" value={tutorFilter} onChange={handleTutorFilterChange}>
          <option value="">All Tutors</option>
          {uniqueTutors.map((tutorName) => (
            <option key={tutorName} value={tutorName}>
              {tutorName}
            </option>
          ))}
        </select>
        {error && <p className="error-message">{error}</p>}
        {filteredClasses.length > 0 ? (
          <ul className="class-list">
            {filteredClasses.map((hostClass) => (
              <li key={hostClass.hostClassID} className="class-item">
                <p>Course: {hostClass.course?.courseName || 'N/A'}</p>
                <p>Topic: {hostClass.topic?.topicName || 'N/A'}</p>
                <p>Tutor: {hostClass.tutor?.tutorName || 'N/A'}</p>
                <button className="view-modules-button" onClick={() => handleViewModules(hostClass.topic.topicID)}>
                  Modules
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#777' }}>No accepted classes found.</p>
        )}
      </div>
    </>
  );
};

export default StudentClassList;