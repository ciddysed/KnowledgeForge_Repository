// src/components/StudentRegister.jsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const StudentRegister = ({ goToLoginPage }) => {
    const [formData, setFormData] = useState({
        studentName: '',
        email: '',
        username: '',
        password: '',
        course: '',
        city: '',
        age: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/students/register', formData);
            alert('Student registered successfully');
        } catch (error) {
            alert('Error registering student');
        }
    };

    return (
        <div>
            {/* Back to Student Login Button */}
            <IconButton onClick={goToLoginPage} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <ArrowBackIcon fontSize="large" color="primary" />
            </IconButton>

            <form onSubmit={handleSubmit}>
                <Typography variant="h5">Register Student</Typography>
                {Object.keys(formData).map((key) => (
                    <TextField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        name={key}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={formData[key]}
                        onChange={handleChange}
                        required
                    />
                ))}
                <Button type="submit" variant="contained" color="primary">
                    Register
                </Button>
            </form>

            {/* Already have an account? */}
            <Typography variant="body2" style={{ marginTop: '10px' }}>
                Already have an account?{' '}
                <Button onClick={goToLoginPage} color="primary">Login</Button>
            </Typography>
        </div>
    );
};

export default StudentRegister;
