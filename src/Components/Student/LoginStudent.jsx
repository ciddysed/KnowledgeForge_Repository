import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginStudent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Using navigate for redirecting

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`http://localhost:8080/api/students/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                const userData = await response.json();

                // Assuming the response contains the JWT token as 'token'
                const token = userData.token;

                // Save the JWT token in localStorage
                localStorage.setItem('jwtToken', token);

                // Optionally save user data as well, if necessary
                localStorage.setItem('loggedInUser', JSON.stringify(userData));

                console.log('Logged in successfully');
                navigate('/studentHome'); // Redirecting to home after login
            } else if (response.status === 401) {
                setError("Invalid username or password.");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (error) {
            setError("An error occurred. Please try again later.");
        }
    };

    return (
        <div className="login-student-container">
            <h1 className="login-student-header">Login as Student</h1>
            {error && <p className="login-student-error">{error}</p>}
            <form onSubmit={handleLogin} className="login-student-form">
                <div className="login-student-form-group">
                    <label className="login-student-label">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="login-student-input"
                    />
                </div>
                <div className="login-student-form-group">
                    <label className="login-student-label">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="login-student-input"
                    />
                </div>
                <button type="submit" className="login-student-submit">Login</button>
            </form>
            <p className="login-student-register-link">
                Don't have an account? <Link to="/registerStudent">Register here.</Link>
            </p>
        </div>
    );
};

export default LoginStudent;
