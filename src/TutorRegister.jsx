// src/components/TutorRegister.jsx
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import React, { useState } from 'react';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TutorRegister = ({ goToLoginPage }) => {
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
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/tutors/register', formData);
            setMessage('Tutor registered successfully!');
            setSeverity('success');
            setOpen(true);
        } catch (error) {
            setMessage('Error registering tutor. Please try again.');
            setSeverity('error');
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <div>
            {/* Back to Tutor Login Button */}
            <IconButton onClick={goToLoginPage} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <ArrowBackIcon fontSize="large" color="primary" />
            </IconButton>

            <form onSubmit={handleSubmit}>
                <Typography variant="h5">Register Tutor</Typography>
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

            {/* Snackbar for feedback messages */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TutorRegister;
