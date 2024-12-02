import React, { useEffect, useState } from "react";
import { FaSearch, FaUserFriends } from "react-icons/fa"; // Add FaUserFriends icon
import { Link, useNavigate } from "react-router-dom";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";
import { subscribeToStudentNotifications } from './WebSocket';

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

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
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
              Logout
            </button>
          </div>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default StudentHome;