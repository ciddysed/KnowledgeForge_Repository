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
      <style>{`
          .home-banner-container {
            position: relative;
            display: flex;
            padding-top: 3rem;
          }

          .home-bannerImage-container {
            position: absolute;
            top: -100px;
            right: -170px;
            z-index: -2;
            max-width: 810px;
          }

          .home-text-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content:  center;
          }

          .primary-heading {
            font-size: clamp(2rem, 5vw, 4rem);
            color: #ffffff;
            line-height: 5rem;
            max-width: 600px;
          }

          .primary-text {
            font-size: clamp(1rem, 3vw, 1.5rem);
            max-width: 500px;
            color: #ffffff;
            margin: 1.5rem 0rem;
          }

          .secondary-button {
            padding: 1rem 2.5rem;
            background-color: #1877F2;
            outline: none;
            border: none;
            border-radius: 5rem;
            font-size: 1.1rem;
            cursor: pointer;
            font-weight: 600;
            color: white;
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
          }

          .secondary-button svg {
            margin-left: 0.75rem;
            font-size: 1.5rem;
          }

          .secondary-button:hover {
            background-color: #0039a6;
          }

          .link-no-underline {
            text-decoration: none;
          }

          .home-image-section {
            position: relative;
            overflow: hidden;
          }

          .home-image-section img {
            width: 100%;
            height: auto;
            transition: transform 0.3s ease, opacity 0.3s ease;
          }

          .home-image-section:hover img {
            transform: scale(1.05);
            opacity: 0.9;
          }
      `}</style>
    </div>
  );
};

export default Home;
