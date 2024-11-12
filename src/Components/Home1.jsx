import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";

const Home1 = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const storedUsername = localStorage.getItem('loggedInUser');
    if (storedUsername) {
      const userData = JSON.parse(storedUsername);
      setUsername(userData.username); // Assuming userData contains username
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser'); // Clear the logged-in user data
    navigate('/loginStudent'); // Redirect to the login page
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
          </button> {/* Logout button */}
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home1;
