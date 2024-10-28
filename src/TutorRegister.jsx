// TutorRegister.js
import React, { useState } from 'react';
import axios from 'axios';

function TutorRegister() {
    const [formData, setFormData] = useState({
        tutorName: '',
        email: '',
        username: '',
        password: '',
        courseMajor: '',
        city: '',
        age: '',
        degrees: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tutors/register', formData);
            alert('Tutor registered successfully');
        } catch (error) {
            alert('Error registering tutor');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Register Tutor</h2>
            {Object.keys(formData).map((key) => (
                <div key={key}>
                    <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                    <input
                        type="text"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                    />
                </div>
            ))}
            <button type="submit">Register</button>
        </form>
    );
}

export default TutorRegister;
