import React, { useEffect, useState } from "react";
import { FaEnvelope, FaSearch, FaUserFriends } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import homeBannerBackground from "../../Assets/home-banner-background.png";
import homeBannerImage from "../../Assets/home-banner-image.png";
import { subscribeToStudentNotifications } from "../WebSocket";
import axios from "axios";

const connectWebSocket = (callback) => {
  callback();
};

const StudentHome = () => {
  const [studentName, setStudentName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUsername = localStorage.getItem("loggedInUser");

    if (storedToken && storedUsername) {
      const userData = JSON.parse(storedUsername);

      // Fetch student profile data to get the student name
      axios.get('http://localhost:8080/api/students/profile', {
        params: { username: userData.username }
      })
      .then(response => {
        setStudentName(response.data.studentName);
      })
      .catch(error => {
        console.error('Error fetching student profile:', error);
      });

      connectWebSocket(() => {
        subscribeToStudentNotifications(userData.username, (message) => {
          console.log("Notification received for student:", message);
          alert(`Notification: ${message}`);
        });
      });
    } else {
      navigate("/loginStudent");
    }
  }, [navigate]);

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={homeBannerBackground} alt="" />
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
                <FaUserFriends className="tile-icon" />
                <p>Booked Tutors</p>
              </Link>
            </div>
            <div className="management-tile">
              <Link to="/Messages" className="tile-link">
                <FaEnvelope className="tile-icon" />
                <p>Messages</p>
              </Link>
            </div>
          </div>
        </div>
        <div className="home-image-section">
          <img src={homeBannerImage} alt="" />
        </div>
      </div>
      <style> {`
        .home-text-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 50vh;
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
          width: 320px;
          height: 220px;
          background-color: lightgray;
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
          position: relative;
        }

        .management-tile:hover {
          background-color: #3498db;
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
          max-width: 600px;
          flex: 1;
        }
`}
</style>

    </div>
  );
};

export default StudentHome;
