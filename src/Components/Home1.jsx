import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa"; // Only keep the FaSearch icon
import { Link } from "react-router-dom";
import BannerBackground from "../Assets/home-banner-background.png";
import BannerImage from "../Assets/home-banner-image.png";

const Home1 = () => {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('loggedInUser');
    if (storedUsername) {
      const userData = JSON.parse(storedUsername);
      setUsername(userData.username);
    }
  }, []);

  

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
            <Link to="/Search" className="management-link creative-link"> {/* New link for Tutor Search */}
              <FaSearch className="link-icon" /> {/* Icon for Tutor Search */}
              Search Tutors
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


