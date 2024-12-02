// src/components/Register.jsx
import React, { useState } from 'react';

const Register = () => {
    const [tutorName, setTutorName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/tutors/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tutorName, email }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            // Handle successful registration (e.g., redirect or show message)
            console.log('Registered successfully');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister}>
                <div>
                    <label>Tutor Name:</label>
                    <input
                        type="text"
                        value={tutorName}
                        onChange={(e) => setTutorName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
