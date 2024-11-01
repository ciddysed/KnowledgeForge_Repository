import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, IconButton, Snackbar, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import React, { useState } from 'react';

// Sample data for tutor login
const sampleTutorData = {
    username: 'tutor123',
    password: 'password123', // Simple password for testing
};

// Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TutorLogin = ({ goToLandingPage, goToRegisterPage, onLoginSuccess }) => { // Added onLoginSuccess prop
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success' or 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
    
        // Validate user input against sample data
        if (credentials.username === sampleTutorData.username && credentials.password === sampleTutorData.password) {
            // Simulate successful login
            onLoginSuccess(); // Call onLoginSuccess to navigate to homepage
        } else {
            setMessage('Login failed');
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
            {/* Back to Landing Page Button */}
            <IconButton onClick={goToLandingPage} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <ArrowBackIcon fontSize="large" color="primary" />
            </IconButton>

            <form onSubmit={handleLogin} style={{ marginTop: '50px' }}>
                <Typography variant="h5" gutterBottom>Tutor Login</Typography>
                <TextField
                    label="Username"
                    name="username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={credentials.username}
                    onChange={handleChange}
                    required
                />
                <TextField
                    label="Password"
                    name="password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '1rem' }}>
                    Login
                </Button>

                {/* Button to navigate to Tutor Register */}
                <Button
                    onClick={goToRegisterPage}
                    variant="text"
                    color="secondary"
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    Create an Account
                </Button>
            </form>

            {/* Snackbar for feedback messages */}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity}>
                    {message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default TutorLogin;
