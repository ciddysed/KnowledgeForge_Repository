import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

  // Initialize the navigate function
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
    try {
      const response = await fetch('http://localhost:8080/api/tutors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();
      console.log("Tutor registered successfully:", data);
      alert("Tutor registered successfully!");

      // Reset form fields after successful registration
      setFormData({
        username: '',
        tutorName: '',
        password: '',
        email: '',
        courseMajor: '',
        city: '',
        age: '',
        degrees: '',
      });

      navigate('/loginTutor');
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registration failed: " + error.message);
    }
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto',
      border: '1px solid #ddd',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#f9f9f9',
    },
    header: {
      textAlign: 'center',
      marginBottom: '20px',
      color: '#333',
    },
    formGroup: {
      marginBottom: '15px',
      position: 'relative',
    },
    label: {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#555',
    },
    input: {
      width: '100%',
      padding: '8px',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
      width: '100%',
      padding: '10px',
      backgroundColor: '#007bff',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    iconButton: {
      color: '#007bff',
      marginBottom: '10px',
    },
    passwordToggle: {
      position: 'absolute',
      right: '10px',
      top: '30px',
      cursor: 'pointer',
      color: '#555',
    },
  };

  return (
    <>
      {/* Icon Button for Back Navigation */}
      <IconButton onClick={handleBack} aria-label="Go back" style={styles.iconButton}>
        <ArrowBackIcon />
      </IconButton>

      <div style={styles.container}>
        <h2 style={styles.header}>Tutor Registration</h2>
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="username" style={styles.label}>Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="tutorName" style={styles.label}>Tutor Name:</label>
            <input
              type="text"
              id="tutorName"
              name="tutorName"
              value={formData.tutorName}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            {/* <span onClick={handleTogglePasswordVisibility} style={styles.passwordToggle}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </span> */}
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="courseMajor" style={styles.label}>Course Major:</label>
            <input
              type="text"
              id="courseMajor"
              name="courseMajor"
              value={formData.courseMajor}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="city" style={styles.label}>City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="age" style={styles.label}>Age:</label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              min="1"
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label htmlFor="degrees" style={styles.label}>Degrees:</label>
            <input
              type="text"
              id="degrees"
              name="degrees"
              value={formData.degrees}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Register</button>
        </form>
      </div>
    </>
  );
};

export default RegisterTutor;
