import React, { useState, useEffect } from 'react';
import './TutorClasses.css';
import { useNavigate } from 'react-router-dom';

const TutorClasses = () => {
  const [classes, setClasses] = useState([]);
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedDate, setUpdatedDate] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [courses, setCourses] = useState([]);
  const token = localStorage.getItem('jwtToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      const tutorId = JSON.parse(localStorage.getItem('loggedInUser')).tutorID;
      try {
        const response = await fetch(`http://localhost:8080/hostclass/tutor/${tutorId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setClasses(data);
          const uniqueCourses = [...new Set(data.map(hostClass => hostClass.course.courseName))];
          setCourses(uniqueCourses);
        } else {
          setError('Failed to fetch classes.');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchClasses();
  }, [token]);

  const handleUpdateClass = async () => {
    if (updatedDescription && updatedDate) {
      try {
        const response = await fetch(`http://localhost:8080/hostclass/${currentClass.hostClassID}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ description: updatedDescription, classDate: updatedDate })
        });

        if (response.ok) {
          setClasses(classes.map(hostClass => 
            hostClass.hostClassID === currentClass.hostClassID 
              ? { ...hostClass, description: updatedDescription, classDate: updatedDate } 
              : hostClass
          ));
          setShowUpdateModal(false);
        } else {
          setError('Failed to update class.');
        }
      } catch (error) {
        console.error('Error updating class:', error);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleDeleteClass = async () => {
    try {
      const response = await fetch(`http://localhost:8080/hostclass/${currentClass.hostClassID}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setClasses(classes.filter(hostClass => hostClass.hostClassID !== currentClass.hostClassID));
        setShowDeleteModal(false);
      } else {
        setError('Failed to delete class.');
      }
    } catch (error) {
      console.error('Error deleting class:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const filteredClasses = selectedCourse === 'All' ? classes : classes.filter(hostClass => hostClass.course.courseName === selectedCourse);

  return (
    <div className={`tutor-classes-container ${showUpdateModal || showDeleteModal ? 'dimmed' : ''}`}>
      <h1 className="tutor-classes-header">Your Hosted Classes</h1>
      {error && <p className="tutor-classes-error">{error}</p>}
      
      <div className="course-filter-buttons">
        {['All', ...courses].map(course => (
          <button 
            key={course} 
            className={`filter-button ${selectedCourse === course ? 'active' : ''}`} 
            onClick={() => setSelectedCourse(course)}
          >
            {course}
          </button>
        ))}
      </div>

      <div className="tutor-classes-list">
        {filteredClasses.map((hostClass) => (
          <div key={hostClass.hostClassID} className="tutor-classes-card">
            <div className="tutor-classes-card-content">
              <h2>{hostClass.course.courseName}</h2>
              <p><strong>Class ID:</strong> {hostClass.hostClassID}</p>
              <p>Topic: {hostClass.topic.topicName}</p>
              <p>Date: {hostClass.classDate}</p>
              <p>Description: {hostClass.description}</p>
              <button onClick={() => { setCurrentClass(hostClass); setUpdatedDescription(hostClass.description); setUpdatedDate(hostClass.classDate); setShowUpdateModal(true); }}>Update</button>
              <button onClick={() => { setCurrentClass(hostClass); setShowDeleteModal(true); }}>Delete</button>
              <button onClick={() => navigate(`/classview`, { state: { hostClass } })}>View Class</button>
            </div>
          </div>
        ))}
      </div>

      {showUpdateModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Update Class</h2>
            <label>Description:</label>
            <textarea value={updatedDescription} onChange={(e) => setUpdatedDescription(e.target.value)} />
            <label>Date:</label>
            <input type="date" value={updatedDate} onChange={(e) => setUpdatedDate(e.target.value)} />
            <button onClick={handleUpdateClass}>Save</button>
            <button onClick={() => setShowUpdateModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Are you sure you want to delete this class?</h2>
            <button onClick={handleDeleteClass}>Yes</button>
            <button onClick={() => setShowDeleteModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorClasses;