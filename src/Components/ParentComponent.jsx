import React, { useState, useEffect } from 'react';
import StudentProfile from './studentProfile';

const ParentComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/me');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchUser();
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return <StudentProfile user={loggedInUser} setUser={setLoggedInUser} />;
};

export default ParentComponent;
