import React, { useEffect, useState } from 'react';
import {
  FaBell,
  FaBook,
  FaClipboardList,
  FaComments,
  FaSignOutAlt,
  FaChalkboardTeacher, // Import icon for "Host a Class"
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import homeBannerBackground from '../../Assets/home-banner-background.png';
import homeBannerImage from '../../Assets/home-banner-image.png';
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
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={homeBannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            {username && <p>Welcome, {username}!</p>}
          </h1>

          <div className="management-links">
            <h2 className="management-heading">Management Pages</h2>
            <Link to="/tutorCourse" className="management-link creative-link">
              <FaBook className="link-icon" />
              Manage Your Courses
            </Link>
            <Link to="/tutorTopic" className="management-link creative-link">
              <FaClipboardList className="link-icon" />
              Manage Your Topics
            </Link>
            <Link to="/notifications" className="management-link creative-link">
              <FaBell className="link-icon" />
              Notifications ({notifications.length})
            </Link>
            <Link to="/chat" className="management-link creative-link">
              <FaComments className="link-icon" />
              Messages
            </Link>
            <Link to="/hostClass" className="management-link creative-link">
              <FaChalkboardTeacher className="link-icon" />
              Host a Class
            </Link>
          </div>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <FaSignOutAlt style={{ marginRight: '8px' }} />
              Logout
            </button>
          </div>
        </div>
        <div className="home-image-section">
          <img src={homeBannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default TutorHome;
