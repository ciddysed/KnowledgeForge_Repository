import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const LoginTutor = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Added password state
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/tutors/login', { // Changed to POST body
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }), // Include password in the request body
            });

            if (!response.ok) {
                throw new Error('Login failed');
            }

            console.log('Logged in successfully');
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
            <div className="login-tutor-container">
                <h1 className="login-tutor-header">Login as Tutor</h1>
                {error && <p className="login-tutor-error">{error}</p>}
                <form onSubmit={handleLogin} className="login-tutor-form">
                    <div className="login-tutor-form-group">
                        <label className="login-tutor-label">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="login-tutor-input"
                        />
                    </div>
                    <div className="login-tutor-form-group">
                        <label className="login-tutor-label">Password:</label>
                        <input
                            type="password"
                            value={password} // Updated to use the defined password state
                            onChange={(e) => setPassword(e.target.value)} // Use setPassword
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
