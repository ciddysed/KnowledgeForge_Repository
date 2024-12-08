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

  // const handleViewClass = async (classId) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/notifications/checkAccess`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ studentUsername: username, classId }),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data.accessGranted) {
  //         navigate(`/classView/${classId}`, { state: { hostClass: data.hostClass } });
  //       } else {
  //         alert('Access denied. You are not accepted for this class.');
  //       }
  //     } else {
  //       alert('Failed to check access.');
  //     }
  //   } catch (error) {
  //     console.error('Error checking access:', error);
  //     alert('An error occurred. Please try again later.');
  //   }
  // };

  const handleViewClasses = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/student/${username}`);
      if (response.ok) {
        const classes = await response.json();
        const acceptedClasses = classes.filter(c => c.accepted);
        if (acceptedClasses.length > 0) {
          navigate(`/studentClassView/${acceptedClasses[0].tutorId}`, { state: { hostClass: acceptedClasses[0] } });
        } else {
          alert('No accepted classes found.');
        }
      } else {
        alert('Failed to fetch classes.');
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('An error occurred. Please try again later.');
    }
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
            <button
              onClick={handleViewClasses}
              className="management-link creative-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '10px',
                padding: '10px 20px',
                color: '#3498db',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <FaUserFriends className="link-icon" style={{ marginRight: '8px' }} />
              View Classes
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
          <img src={homeBannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default StudentHome;