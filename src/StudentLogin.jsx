import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Alert, Button, CircularProgress, IconButton, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';

const StudentLogin = ({ onLoginSuccess, goToLandingPage, onRegisterClick }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/students/login', null, {
                params: { username, password },
            });
            onLoginSuccess(response.data);
        } catch (error) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <IconButton onClick={goToLandingPage} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <ArrowBackIcon fontSize="large" color="primary" />
            </IconButton>
            <form onSubmit={handleLogin} style={{ marginTop: '50px' }}>
                <Typography variant="h5" gutterBottom>Student Login</Typography>
                {error && <Alert severity="error" style={{ marginBottom: '1rem' }}>{error}</Alert>}
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
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    disabled={loading}
                    style={{ marginTop: '1rem', position: 'relative' }}
                >
                    {loading ? <CircularProgress size={24} style={{ color: 'white' }} /> : 'Login'}
                </Button>
                <Button 
                    onClick={onRegisterClick} 
                    variant="outlined" 
                    color="primary" 
                    fullWidth 
                    style={{ marginTop: '1rem' }}
                >
                    Don't have an account? Register
                </Button>
            </form>
        </div>
    );
};

export default StudentLogin;
