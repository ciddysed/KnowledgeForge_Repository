import React, { useEffect, useState } from "react";
import { FaBook, FaLayerGroup, FaQuestionCircle, FaSearch, FaSignOutAlt, FaTasks } from "react-icons/fa"; // Added FaSearch icon
import { Link, useNavigate } from "react-router-dom";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";

const Home2 = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('loggedInUser');
    if (storedUsername) {
      const userData = JSON.parse(storedUsername);
      setUsername(userData.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/admin');
  };

  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            {username && <p>Hello, admin!</p>}
          </h1>

          <button onClick={handleLogout} className="logout-button creative-btn">
            <FaSignOutAlt className="logout-icon" /> {/* Logout icon */}
            Logout
          </button>

          <div className="management-links">
            <h2 className="management-heading">Management Pages</h2>
            <Link to="/courseManagement" className="management-link creative-link">
              <FaBook className="link-icon" /> {/* Icon for Course Management */}
              Course Management
            </Link>
            <Link to="/topicManagement" className="management-link creative-link">
              <FaLayerGroup className="link-icon" /> {/* Icon for Topic Management */}
              Topic Management
            </Link>
            <Link to="/quizManagement" className="management-link creative-link">
              <FaQuestionCircle className="link-icon" /> {/* Icon for Quiz Management */}
              Quiz Management
            </Link>
            <Link to="/moduleManagement" className="management-link creative-link">
              <FaTasks className="link-icon" /> {/* Icon for Module Management */}
              Module Management
            </Link>
            <Link to="/students" className="management-link creative-link">
              <FaSearch className="link-icon" /> {/* Icon for Tutor Search */}
              Accept Students
            </Link>
          </div>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home2;
