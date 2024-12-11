import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginTutor = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        const token = userData.token;
        localStorage.setItem('jwtToken', token);
        localStorage.setItem('loggedInUser', JSON.stringify(userData));
        console.log('Logged in successfully');
        navigate('/tutorHome');
      } else if (response.status === 401) {
        setError('Invalid username or password.');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
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
        <div className="login-tutor-form-group">
          <label className="login-tutor-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-tutor-input"
          />
        </div>
        <button type="submit" className="login-tutor-submit">Login</button>
      </form>
      <p className="login-tutor-register-link">
        Don't have an account? <Link to="/RegisterTutor">Register here.</Link>
      </p>
      <style> {`
        :root {
          --primary-color: #66a6ff;
          --secondary-color: #45a049;
          --error-color: #ff4d4d;
          --background-color: rgba(220, 220, 220, 0.1);
          --text-color: black;
          --input-border-color: #ddd;
          --input-focus-border-color: var(--primary-color);
          --button-background-color: blue;
          --button-hover-background-color: var(--secondary-color);
        }

        .login-tutor-container {
          background-color: var(--background-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 45vh;
          width: 25%;
          padding: 20px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border-radius: 50px;

          position: absolute;
          top: 40%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: fadeBlur 2s ease-in-out;
          filter: blur(0px);
        }

        .login-tutor-header {
          font-size: 2rem;
          color: black;
          margin-bottom: 20px;
          text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
        }

        .login-tutor-error {
          color: #ff4d4d;
          margin-bottom: 10px;
          font-size: 1rem;
        }

        .login-tutor-form {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .login-tutor-form-group {
          margin-bottom: 15px;
          width: 100%;
          text-align: left;
        }

        .login-tutor-label {
          font-size: 1rem;
          color: black;
          margin-bottom: 5px;
          display: block;
        }

        .login-tutor-input {
          width: 100%;
          max-width: 300px;
          padding: 10px;
          font-size: 1rem;
          border: 2px solid #ddd;
          border-radius: 5px;
          outline: none;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .login-tutor-input:focus {
          border-color: #66a6ff;
          box-shadow: 0 0 6px rgba(102, 166, 255, 0.5);
        }

        .login-tutor-submit {
          margin-top: 15px;
          width: 100%;
          max-width: 300px;
          padding: 10px;
          font-size: 1rem;
          background-color: blue;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }

        .login-tutor-submit:hover {
          background-color: #45a049;
          transform: scale(1.05);
        }

        .login-tutor-register-link {
          margin-top: 40px;
          font-size: 1rem;
          color: black;
          text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
        }

        .login-tutor-register-link a {
          color: var(--primary-color);
          text-decoration: none;
        }

        .login-tutor-register-link a:hover {
          text-decoration: underline;
        }
        @media (max-width: 768px) {
          .login-student-container {
            width: 80%;
            height: auto;
            padding: 20px;
          }

          .login-student-input,
          .login-student-submit {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginTutor;
