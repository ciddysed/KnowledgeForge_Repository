import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginTutor = () => {
    const [username, setUsername] = useState(''); // Changed from email to username
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/tutors/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem('loggedInUser', JSON.stringify(userData));
                console.log('Logged in successfully');
                navigate('/home2');
            } else if (response.status === 401) {
                setError('Invalid username or password.');
            } else {
                setError('Login failed. Please try again.');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-tutor-container">
            <h1 className="login-tutor-header">Login as Tutor</h1>
            {error && <p className="login-tutor-error">{error}</p>}
            <form onSubmit={handleLogin} className="login-tutor-form">
                <div className="login-tutor-form-group">
                    <label className="login-tutor-label">Username:</label> {/* Updated label */}
                    <input
                        type="text" // Changed to text since it's a username
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} // Updated state
                        required
                        className="login-tutor-input"
                    />
                </div>
                <div className="login-tutor-form-group">
                    <label className="login-tutor-label">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-tutor-input"
                    />
                </div>
                <button type="submit" className="login-tutor-submit">Login</button>
            </form>
            <p className="login-tutor-register-link">
                Don't have an account? <Link to="/RegisterTutor">Register here.</Link>
            </p>
        </div>
    );
};

export default LoginTutor;
