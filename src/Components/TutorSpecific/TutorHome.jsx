import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { subscribeToTutorNotifications } from '../WebSocket'; // Import WebSocket helper

const TutorHome = () => {
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve logged-in tutor's username
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsername(userData.username);

      // Fetch notifications related to the tutor
      fetchNotifications(userData.username);

      // Subscribe to real-time notifications
      subscribeToTutorNotifications(`/notification/tutor/${userData.username}`, (message) => {
        alert(`New notification: ${message}`);
        // Optionally, update the notifications list dynamically
        setNotifications((prev) => [...prev, message]);
      });
    } else {
      navigate('/loginTutor');
    }
  }, [navigate]);

  const fetchNotifications = async (tutorUsername) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/${tutorUsername}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('jwtToken');
    navigate('/loginTutor');
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <button onClick={handleLogout}>Logout</button>
      <div style={{ marginTop: '20px' }}>
        <Link
          to="/tutorCourse"
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '10px',
          }}
        >
          Manage Your Courses
        </Link>
        <Link
          to="/tutorTopic"
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Manage Your Topics
        </Link>
      </div>

      {/* Notification Button */}
      <div style={{ marginTop: '20px' }}>
        <Link
          to="/notifications"
          style={{
            padding: '10px 20px',
            backgroundColor: '#e67e22',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
          }}
        >
          Notifications ({notifications.length})
        </Link>
      </div>
    </div>
  );
};

export default TutorHome;
