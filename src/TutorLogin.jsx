// TutorLogin.js
import React, { useState } from 'react';
import axios from 'axios';

function TutorLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tutors/login', null, { params: credentials });
            alert('Login successful');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="text"
                name="username"
                placeholder="Username"
                value={credentials.username}
                onChange={handleChange}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
            />
            <button type="submit">Login</button>
        </form>
    );
}

export default TutorLogin;
