import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
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

    try {
      const response = await fetch('http://localhost:8080/api/students/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <IconButton onClick={handleBack} aria-label="Go back" style={{ position: 'absolute', top: 20, left: 20, color: '#007bff' }}>
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
    </div>
  );
};

export default RegisterStudent;
