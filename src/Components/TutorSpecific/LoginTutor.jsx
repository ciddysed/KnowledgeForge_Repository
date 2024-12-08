import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
        const data = await response.json();

        // Save JWT token to localStorage
        const token = data.token;  // assuming the response contains the token in 'token'
        localStorage.setItem('jwtToken', token);

        // Optionally store user data (if needed)
        localStorage.setItem('loggedInUser', JSON.stringify(data));

        // Navigate to the tutor home page
        navigate('/tutorHome');
      } else if (response.status === 401) {
        setError('Invalid username or password.');
      } else {
        const errorData = await response.json();
        setError(`Login failed: ${errorData.message || 'Please try again.'}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again later.');
    }
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
            style={{ paddingRight: '30px' }} // Adjust padding for the toggle button
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
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