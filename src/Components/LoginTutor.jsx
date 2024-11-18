import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginTutor = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(
        `http://localhost:8080/api/tutors/login?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        navigate('/home2');
      } else if (response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-tutor-container">
      <h1 className="login-tutor-header">Login as Tutor</h1>
      {error && <p className="login-tutor-error">{error}</p>}
      <form onSubmit={handleLogin} className="login-tutor-form">
        <div className="login-tutor-form-group">
          <label className="login-tutor-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="login-tutor-input"
          />
        </div>
        <div className="login-tutor-form-group" style={{ position: 'relative' }}>
          <label className="login-tutor-label">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-tutor-input"
            style={{ paddingRight: '40px' }} // Add padding to make space for the icon
          />
          <IconButton
            onClick={togglePasswordVisibility}
            style={{
              position: 'absolute',
              right: '10px',
              top: '70%',
              VisibilityOff,
              transform: 'translateY(-50%)',
              padding: 0,
            }}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        <button type="submit" className="login-tutor-submit">Login</button>
      </form>
      <p className="login-tutor-register-link">
        Don't have an account? <Link to="/RegisterTutor">Register here.</Link>
      </p>
    </div>
  );
};

export default LoginTutor;
