import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterTutor = () => {
  const [formData, setFormData] = useState({
    username: '',
    tutorName: '',
    password: '',
    email: '',
    courseMajor: '',
    city: '',
    age: '',
    degrees: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Function to handle going back to the previous page
  const handleBack = () => {
    navigate(-1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      const response = await fetch('http://localhost:8080/api/tutors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error in registration');
      }

      const data = await response.json();
      console.log('Registered successfully:', data);
      alert('Registration successful!');

      navigate('/loginTutor');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  return (
    <div className="tutor-register-container">
      <style> {`
        .tutor-register-container {
          background-color: var(--background-color);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: auto;
          width: 25%;
          max-width: 800px;
          min-width: 300px;
          padding: 20px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border-radius: 50px;
          position: absolute;
          top: 57%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: fadeBlur 2s ease-in-out;
          filter: blur(0px);
          transition: padding-bottom 0.3s ease-in-out;
        }

        .tutor-register-container h2 {
          font-size: 2rem;
          color: black;
          margin-bottom: 20px;
          text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
        }

          .form-group {
            margin-bottom: 15px;
            width: 100%;
            text-align: left;
          }

          .form-group label {
            font-size: 1rem;
            color: black;
            margin-bottom: 5px;
            display: block;
          }

          .form-group input {
            width: 100%;
            max-width: 300px;
            padding: 10px;
            font-size: 1rem;
            border: 2px solid #ddd;
            border-radius: 5px;
            outline: none;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .form-group input:focus {
            border-color: #66a6ff;
            box-shadow: 0 0 6px rgba(102, 166, 255, 0.5);
          }

          .primary-button {
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

          .primary-button:hover {
            background-color: #45a049;
            transform: scale(1.05);
          }

          .profile-image-container {
            margin-top: 10px;
            text-align: center;
          }

          .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          }
        `}
      </style>

      {/* Icon Button for Back Navigation */}
      <IconButton onClick={handleBack} aria-label="Go back" style={{ position: 'absolute', top: 20, left: 20, color: '#ffffff' }}>
        <ArrowBackIcon />
      </IconButton>

      <h2>Tutor Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Password:</label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {/* Password visibility toggle button */}
          <IconButton
            onClick={() => setShowPassword((prev) => !prev)}
            style={{ position: 'absolute', right: 0, top: '70%', transform: 'translateY(-50%)' }}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        <div className="form-group">
          <label htmlFor="tutorName">Tutor Name:</label>
          <input
            type="text"
            id="tutorName"
            name="tutorName"
            value={formData.tutorName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseMajor">Course Major:</label>
          <input
            type="text"
            id="courseMajor"
            name="courseMajor"
            value={formData.courseMajor}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="degrees">Degrees:</label>
          <input
            type="text"
            id="degrees"
            name="degrees"
            value={formData.degrees}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="primary-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterTutor;
