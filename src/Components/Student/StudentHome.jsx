import React, { useEffect, useState } from "react";
import { FaEnvelope, FaSearch, FaUserFriends } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import homeBannerBackground from "../../Assets/home-banner-background.png";
import homeBannerImage from "../../Assets/home-banner-image.png";
import { subscribeToStudentNotifications } from "../WebSocket";

const connectWebSocket = (callback) => {
  callback();
};

const StudentHome = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("jwtToken");
    const storedUsername = localStorage.getItem("loggedInUser");

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
      navigate("/loginStudent");
    }
  }, [navigate]);

  const handleBookedTutors = () => {
    navigate("/bookedTutors");
  };

  const handleMessages = () => {
    navigate("/bookedTutors");
  };

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={homeBannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            {username && (
              <p>
                Welcome, <span className="highlight">{username}</span>!
              </p>
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
              <button onClick={handleBookedTutors} className="tile-link">
                <FaUserFriends className="tile-icon" />
                <p>Booked Tutors</p>
              </button>
            </div>
            <div className="management-tile">
              <button onClick={handleMessages} className="tile-link">
                <FaEnvelope className="tile-icon" />
                <p>Messages</p>
              </button>
            </div>
          </div>
        </div>
        <div className="home-image-section">
          <img src={homeBannerImage} alt="" />
        </div>
      </div>
      <style>
  {`
    .home-text-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 50vh;
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
      justify-content: space-between;
      padding: 25px;
      width: 320px;
      height: 220px;
      background-color: #ffffff;
      border-radius: 15px;
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: left;
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
      font-size: 3rem;
      color: #3498db;
      margin-bottom: 10px;
      align-self: flex-start;
    }

    .tile-link:hover .tile-icon {
      color: #fff;
    }

    .highlight {
      color: #3498db;
    }

    p {
      font-size: 1.2rem;
      margin: 0;
    }
  `}
</style>

    </div>
  );
};

export default StudentHome;
