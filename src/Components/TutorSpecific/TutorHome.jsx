import React, { useEffect, useState } from 'react';
import { useNavigate, Link  } from 'react-router-dom';

const TutorHome = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsername(userData.username);
    } else {
      navigate('/loginTutor');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('jwtToken');
    navigate('/loginTutor');
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      <button onClick={handleLogout}>Logout</button>
      <div style={{ marginTop: '20px' }}>
        <Link to="/tutorCourse" style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>
          Manage Your Courses
        </Link>
      </div>
    </div>
  );
};

export default TutorHome;