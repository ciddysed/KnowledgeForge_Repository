import React, { useState, useEffect } from 'react';
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
      <style>{`
        .tutor-classes-container {
          width: 100%;
          margin: 25px auto;
          padding: 50px;
          box-sizing: border-box;
          background color: rgba(0, 0, 0, 0.1);
          border-radius: 25px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6);
          font-family: 'Arial', sans-serif;
        }
        .tutor-classes-header {
          text-align: center;
          margin-bottom: 20px;
          font-size: 2.5em;
          color: #000000;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
        }
        .tutor-classes-error {
          color: red;
          text-align: center;
          font-weight: bold;
        }
        .course-filter-buttons {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }
        .filter-button {
          margin: 0 10px;
          padding: 10px 20px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 25px;
          transition: background-color 0.3s ease;
        }
        .filter-button.active {
          background-color: #0056b3;
        }
        .filter-button:hover {
          background-color: #0056b3;
        }
        .tutor-classes-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
        }
        .tutor-classes-card {
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid #ddd;
          border-radius: 10px;
          margin: 10px;
          padding: 20px;
          width: 350px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .tutor-classes-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
        }
        .tutor-classes-card-content {
          text-align: left;
        }
        .tutor-classes-card-content h2 {
          margin-top: 0;
          font-size: 1.5em;
          color: #007bff;
        }
        .tutor-classes-card-content p {
          margin: 5px 0;
          color: #555;
        }
        .tutor-classes-card-content button {
          margin-right: 10px;
          padding: 10px 20px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .tutor-classes-card-content button:last-child {
          background-color: #28a745;
        }
        .tutor-classes-card-content button:hover {
          background-color: #0056b3;
        }
        .modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          animation: fadeIn 0.3s ease;
        }
        .modal-content {
          background-color: white;
          padding: 20px;
          border-radius: 10px;
          width: 400px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .modal-content h2 {
          margin-top: 0;
          font-size: 1.8em;
          color: #333;
        }
        .modal-content label {
          display: block;
          margin: 10px 0 5px;
          font-weight: bold;
          color: #555;
        }
        .modal-content textarea,
        .modal-content input {
          width: 100%;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }
        .modal-content button {
          margin-right: 10px;
          padding: 10px 20px;
          border: none;
          background-color: #007bff;
          color: white;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        .modal-content button:last-child {
          background-color: #dc3545;
        }
        .modal-content button:hover {
          background-color: #0056b3;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
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