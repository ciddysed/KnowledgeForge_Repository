// src/components/Register.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';

// Create an Alert component for Snackbar
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const StudentRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success'); // 'success' or 'error'
    const [open, setOpen] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        const studentData = { username, email, password };

        try {
            const response = await axios.post('/api/students/register', studentData);
            console.log("Registration successful:", response.data);
            setMessage("Registration successful!"); // Set success message
            setSeverity('success');
            setOpen(true);
            // Optionally reset form or redirect to login
            setUsername('');
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error("There was an error registering the student!", error);
            setMessage("Registration failed! Please try again."); // Set error message
            setSeverity('error');
            setOpen(true);
        }
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (
        <div>
            <form onSubmit={handleRegister}>
                <Typography variant="h5">Register Student</Typography>
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
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    Register
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

export default StudentRegister;
