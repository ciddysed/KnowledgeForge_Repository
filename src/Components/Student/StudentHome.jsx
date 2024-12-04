import React, { useEffect, useState } from "react";
import { FaEnvelope, FaSearch, FaUserFriends } from "react-icons/fa"; // Add FaEnvelope icon
import { Link, useNavigate } from "react-router-dom";
import homeBannerBackground from '../../Assets/home-banner-background.png';
import homeBannerImage from '../../Assets/home-banner-image.png';
import { subscribeToStudentNotifications } from '../WebSocket';

const connectWebSocket = (callback) => {
  // WebSocket connection logic here
  callback();
};

const StudentHome = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get JWT token from localStorage
    const storedToken = localStorage.getItem('jwtToken');
    const storedUsername = localStorage.getItem('loggedInUser');

    // Check if token and user data are available
    if (storedToken && storedUsername) {
      const userData = JSON.parse(storedUsername);
      setUsername(userData.username);

      connectWebSocket(() => {
        subscribeToStudentNotifications(userData.username, (message) => {
          console.log("Notification received for student:", message);
          alert(`Notification: ${message}`);
        });
      });
    } else {
      // If no token or user data, redirect to login page
      navigate('/loginStudent');
    }
  }, [navigate]);

  // Logout function to remove the token and user data
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('loggedInUser');
    navigate('/loginStudent');
  };

  const handleBookedTutors = () => {
    navigate('/bookedTutors');
  };

  const handleMessages = () => {
    navigate('/bookedTutors');
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
            <Link to="/Search" className="management-link creative-link">
              <FaSearch className="link-icon" />
              Search Tutors </Link>
            <button
              onClick={handleBookedTutors}
              className="management-link creative-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                padding: '10px 20px',
                color: '#3498db', // Match the text color with Search Tutors button
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <FaUserFriends className="link-icon" style={{ marginRight: '8px' }} />
              Booked Tutors
            </button>
            <button
              onClick={handleMessages}
              className="management-link creative-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                padding: '10px 20px',
                color: '#3498db', // Match the text color with Search Tutors button
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <FaEnvelope className="link-icon" style={{ marginRight: '8px' }} />
              Messages
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

export default StudentHome;