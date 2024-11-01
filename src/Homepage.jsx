import React from 'react';
import './Homepage.css'; // Add your CSS for homepage styling

const Homepage = () => {
  return (
    <div className="homepage">
      <h1>Welcome to KnowledgeForge</h1>
      <h2>Your Online Tutoring System</h2>
      <div className="features">
        <div className="feature">
          <h3>Browse Courses</h3>
          <p>Explore a variety of courses offered by our tutors.</p>
        </div>
        <div className="feature">
          <h3>Schedule a Session</h3>
          <p>Book a tutoring session that fits your schedule.</p>
        </div>
        <div className="feature">
          <h3>Connect with Tutors</h3>
          <p>Find and connect with tutors who match your learning needs.</p>
        </div>
        {/* Add more features as needed */}
      </div>
    </div>
  );
};

export default Homepage;
