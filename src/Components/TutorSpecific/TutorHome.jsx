import React, { useEffect, useState } from 'react';
import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardList,
  FaComments,
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { subscribeToTutorNotifications } from '../WebSocket'; // Import WebSocket helper

const TutorHome = () => {
  const [tutorName, setTutorName] = useState(''); // Add state for tutorName
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve logged-in tutor's username
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);

      // Fetch tutorName by username
      fetchTutorName(userData.username);

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

  const fetchTutorName = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/api/tutors/username/${username}`);
      if (response.ok) {
        const data = await response.json();
        setTutorName(data.tutorName); // Set tutorName from response
      } else {
        console.error('Failed to fetch tutor name');
      }
    } catch (error) {
      console.error('Error fetching tutor name:', error);
    }
  };

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

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-text-section">
          <h1 className="primary-heading">
            {tutorName && (
              <span className="welcome-text">
                Welcome, <span className="highlight">{tutorName}</span>!
              </span>
            )}
          </h1>
          <div className="management-links">
            <div className="management-tile">
              <Link to="/tutorCourse" className="tile-link">
                <FaBook className="tile-icon" />
                <p>Manage Your Courses</p>
              </Link>
            </div>
            <div className="management-tile">
              <Link to="/tutorTopic" className="tile-link">
                <FaClipboardList className="tile-icon" />
                <p>Manage Your Topics</p>
              </Link>
            </div>
            <div className="management-tile">
              <Link to="/notifications" className="tile-link">
                <FaComments className="tile-icon" />
                <p>Chat ({notifications.length})</p>
              </Link>
            </div>
            <div className="management-tile">
              <Link to="/hostClass" className="tile-link">
                <FaChalkboardTeacher className="tile-icon" />
                <p>Host a Class</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style> {`
        .home-text-section {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 60vh;
          margin: 0 auto;
        }
        
        .home-bannerImage-container {
          position: absolute;
          top: -5px;
          right: -125px;
          z-index: -2;
          max-width: 700px;
        }

        .primary-heading {
          margin-bottom: 50px;
          font-size: 4rem; /* Adjust the size as needed */
        }

        .management-links {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 30px;
          width: 100%;
          margin-top: 20px;
        }

        .management-tile {
          display: flex;
          flex-direction: column;
          align-items: center; /* Center children horizontally */
          justify-content: center; /* Center children vertically */
          padding: 25px;
          width: 275px;
          height: 250px;
          background-color: #ffffff;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
        }

        .management-tile:hover {
          background-color: #000000;
          color: #fff;
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(52, 152, 219, 0.3);
        }

        .tile-link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-between;
          width: 100%;
          height: 100%;
          border: none; /* Remove border color */
        }

        .tile-icon {
          font-size: 6rem;
          color: #3498db;
          margin-bottom: 10px;
          align-self: center; /* Center horizontally */
          justify-self: center; /* Center vertically */
        }

        .tile-link:hover .tile-icon {
          color: #fff;
        }

        .welcome-text {
          color: black; /* Change text color to black */
        }

        .highlight {
          color: #ffffff;
        }

        p {
          font-size: 1.2rem;
          margin: 0;
          text-align: center; /* Center text horizontally */
          align-self: center; /* Center element horizontally */
          justify-self: center; /* Center element vertically */
        }
        .home-image-section {
          max-width: 100px;
          flex: 1;
        }
      `}
      </style>
    </div>
  );
};

export default TutorHome;
