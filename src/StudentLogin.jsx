// src/components/Login.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const StudentLogin = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/students/login', null, {
                params: { username, password },
            });
            console.log("Login successful:", response.data);
            onLoginSuccess(response.data); // Handle successful login
        } catch (error) {
            console.error("Login failed!", error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <Typography variant="h5">Login</Typography>
            <TextField
                label="Username"
                variant="outlined"
                fullWidth
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <Button type="submit" variant="contained" color="primary">
                Login
            </Button>
        </form>
    );
};

export default StudentLogin;
