import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import Link for navigation
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";

const Home1 = () => {
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
    navigate('/loginStudent');
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
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
          <div className="management-links">
            <h2>Management Pages</h2>
            <Link to="/courseManagement" className="management-link">
              Course Management
            </Link>
            <Link to="/topicManagement" className="management-link">
              Topic Management
            </Link>
            <Link to="/quizManagement" className="management-link">
              Quiz Management
            </Link>
            <Link to="/moduleManagement" className="management-link">
              Module Management
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

export default Home1;
