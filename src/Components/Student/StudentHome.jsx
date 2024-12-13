import React, { useEffect, useState } from "react";
import { FaEnvelope, FaSearch, FaChalkboardTeacher, FaUsers } from "react-icons/fa"; // Add FaEnvelope icon
import { Link, useNavigate } from "react-router-dom";
import homeBannerBackground2 from '../../Assets/home-banner-background-2.png';
import { subscribeToStudentNotifications } from '../WebSocket';

const connectWebSocket = (callback) => {
  // WebSocket connection logic here
  callback();
};

const StudentHome = () => {
  const [studentName, setStudentName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get JWT token from localStorage
    const storedToken = localStorage.getItem('jwtToken');
    const storedUsername = localStorage.getItem('loggedInUser');

    // Check if token and user data are available
    if (storedToken && storedUsername) {
      const userData = JSON.parse(storedUsername);
      setStudentName(userData.studentName);

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

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={homeBannerBackground2} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            {studentName && (
              <span className="welcome-text">
                Welcome, <span className="highlight">{studentName}</span>!
              </span>
            )}
          </h1>
          <div className="management-links">
            <div className="management-tile">
              <Link to="/Search" className="tile-link">
                <FaSearch className="tile-icon" />
                <p>Search Tutors</p>
              </Link>
            </div>
            <div className="management-tile">
              <Link to="/bookedTutors" className="tile-link">
                <FaChalkboardTeacher className="tile-icon" />
                <p>Booked Tutors</p>
              </Link>
            </div>
            <div className="management-tile">
              <Link to="/Messages" className="tile-link">
                <FaEnvelope className="tile-icon" />
                <p>Messages</p>
              </Link>
            </div>
            <div className="management-tile">
              <Link to="/studentClassList" className="tile-link">
                <FaUsers className="tile-icon" />
                <p>View Classes</p>
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
          align-items: flex-start;
          height: 60vh;
        }
        
        .home-bannerImage-container {
          position: absolute;
          top: -5px;
          right: -125px;
          z-index: -2;
          max-width: 700px;
        }

        .home-bannerImage-container:hover img {
          transform: scale(1.05);
          opacity: 0.9;
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
      `}
      </style>
    </div>
  );
};

export default StudentHome;