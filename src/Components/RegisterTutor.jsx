import React, { useState } from 'react';

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

      const data = await response.json(); // Get response data
      console.log("Tutor registered successfully:", data); // Log the successful response
      alert("Tutor registered successfully!"); // Show success message

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
    } catch (error) {
      console.error('Registration failed:', error);
      alert("Registration failed: " + error.message); // Show error message
    }
  };

  return (
    <div className="tutor-register-container">
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
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
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
