import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudentClassList.css'; // Import the CSS file

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
    <div className="class-list-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Active Classes</h1>
      <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <select className="tutor-filter" value={tutorFilter} onChange={handleTutorFilterChange} style={{ padding: '10px', marginBottom: '20px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}>
          <option value="">All Tutors</option>
          {uniqueTutors.map((tutorName) => (
            <option key={tutorName} value={tutorName}>
              {tutorName}
            </option>
          ))}
        </select>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        {filteredClasses.length > 0 ? (
          <ul className="class-list" style={{ listStyleType: 'none', padding: '0' }}>
            {filteredClasses.map((hostClass) => (
              <li key={hostClass.hostClassID} className="class-item" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)' }}>
                <p style={{ marginBottom: '10px', color: '#555' }}>Course: {hostClass.course?.courseName || 'N/A'}</p>
                <p style={{ marginBottom: '10px', color: '#555' }}>Topic: {hostClass.topic?.topicName || 'N/A'}</p>
                <p style={{ marginBottom: '10px', color: '#555' }}>Tutor: {hostClass.tutor?.tutorName || 'N/A'}</p>
                <button className="view-modules-button" onClick={() => handleViewModules(hostClass.topic.topicID)} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Modules</button>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#777' }}>No accepted classes found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentClassList;