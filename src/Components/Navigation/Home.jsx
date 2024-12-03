import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from 'react-router-dom';
import homeBannerBackground from '../../Assets/home-banner-background.png';
import homeBannerImage from '../../Assets/home-banner-image.png';

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={homeBannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Welcome to KnowledgeForge
          </h1>
          <p className="primary-text">
            Your gateway to learning and growth.
          </p>
          <Link to="/LoginPage" className="link-no-underline">
            <button className="secondary-button">
              Get Started <FiArrowRight />{" "}
            </button>
          </Link>
        </div>
        <div className="home-image-section">
          <img src={homeBannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
