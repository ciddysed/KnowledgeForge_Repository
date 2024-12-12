import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    studentName: '',
    email: '',
    courseYear: '',
    city: '',
    age: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

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
      const response = await fetch('http://localhost:8080/api/students/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error in registration');
      }

      const data = await response.json();
      console.log('Registered successfully:', data);
      alert('Registration successful!');

      navigate('/loginStudent');
    } catch (error) {
      console.error('Registration failed:', error);
      alert('Registration failed: ' + error.message);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="student-register-container">
      {/* Back Button */}
      <IconButton onClick={handleBack} aria-label="Go back" style={{ position: 'absolute', top: 20, left: 20, color: '#ffffff' }}>
        <ArrowBackIcon />
      </IconButton>

      <h2>Student Registration</h2>
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
            onClick={togglePasswordVisibility}
            style={{ position: 'absolute', right: 0, top: '70%', transform: 'translateY(-50%)' }}
            aria-label="Toggle password visibility"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>
        <div className="form-group">
          <label htmlFor="studentName">Student Name:</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={formData.studentName}
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
          <label htmlFor="courseYear">Course Year:</label>
          <input
            type="text"
            id="courseYear"
            name="courseYear"
            value={formData.courseYear}
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
        <button type="submit" className="primary-button">Register</button>
      </form>
      <style>{`
        .student-register-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: auto;
            width: 25%; /* Adjusted for a more balanced layout */
            max-width: 800px; /* Ensures it doesnt stretch too wide on larger screens */
            min-width: 300px; /* Ensures it stays readable on smaller screens */
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

        .student-register-container h2 {
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
  `}
</style>

    </div>
  );
};

export default RegisterStudent;