import React from 'react';
import { BsFillPlayCircleFill } from "react-icons/bs";
import aboutBackgroundImage from '../../Assets/about-background-image.png';
import aboutBackground from '../../Assets/about-background.png';

const About = () => {
  return (
    <div className="about-section-container">
      <div className="about-background-image-container">
        <img src={aboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={aboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>
        <h1 className="primary-heading">
          Online Tutor Is An Important Part Of A Knowledge
        </h1>
        <p className="primary-text">
          Welcome to KnowledgeForge, your trusted platform for connecting learners with tutors. At Knowledge Forge, we believe that quality education should be accessible, personalized, and convenient. 
        </p>
        <p className="primary-text">
        KnowledgeForge empowers students to find the perfect tutor based on their specific learning needs, subjects, and goals.
        </p>
        <div className="about-buttons-container">
          <button className="secondary-button">Learn More</button>
          <button className="watch-video-button">
            <BsFillPlayCircleFill /> Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;