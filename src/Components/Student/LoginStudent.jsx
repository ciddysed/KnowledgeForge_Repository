import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
 
const LoginStudent = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
 
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
                const token = userData.token;
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('loggedInUser', JSON.stringify(userData));
               
                // Store profile image URL in localStorage
                if (userData.profileImage) {
                    const profileImageUrl = `http://localhost:8080/${userData.profileImage}`;
                    localStorage.setItem('profileImage', profileImageUrl);
 
                    // Dispatch custom event to update profile image in NavbarStudent
                    const profileUpdateEvent = new CustomEvent('profileUpdate', {
                        detail: { profileImage: profileImageUrl },
                    });
                    window.dispatchEvent(profileUpdateEvent);
                }
 
                console.log('Logged in successfully');
                navigate('/studentHome');
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
            <style>{`
                :root {
                    --primary-color: #66a6ff;
                    --secondary-color: #45a049;
                    --error-color: #ff4d4d;
                    --background-color: rgba(220, 220, 220, 0.1);
                    --text-color: black;
                    --input-border-color: #ddd;
                    --input-focus-border-color: var(--primary-color);
                    --button-background-color: blue;
                    --button-hover-background-color: var(--secondary-color);
                }
 
                .login-student-container {
                    background-color: var(--background-color);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 45vh;
                    width: 25%;
                    padding: 20px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
                    border-radius: 50px;
                    position: absolute;
                    top: 40%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: fadeBlur 2s ease-in-out;
                    filter: blur(0px);
                    transition: all 0.3s ease-in-out;
                }
 
                .login-student-header {
                    font-size: 2rem;
                    color: var(--text-color);
                    margin-bottom: 30px;
                    text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
                }
 
                .login-student-error {
                    color: var(--error-color);
                    margin-bottom: 10px;
                    font-size: 1rem;
                }
 
                .login-student-form {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
 
                .login-student-form-group {
                    margin-bottom: 15px;
                    width: 100%;
                    text-align: left;
                }
 
                .login-student-label {
                    font-size: 1rem;
                    color: var(--text-color);
                    margin-bottom: 5px;
                    display: block;
                }
 
                .login-student-input {
                    width: 100%;
                    max-width: 300px;
                    padding: 10px;
                    font-size: 1rem;
                    border: 2px solid var(--input-border-color);
                    border-radius: 5px;
                    outline: none;
                    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
                    transition: border-color 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
                }
 
                .login-student-input:focus {
                    border-color: var(--input-focus-border-color);
                    box-shadow: 0 0 6px rgba(102, 166, 255, 0.5);
                }
 
                .login-student-submit {
                    margin-top: 15px;
                    width: 100%;
                    max-width: 300px;
                    padding: 10px;
                    font-size: 1rem;
                    background-color: var(--button-background-color);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;
                    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
                }
 
                .login-student-submit:hover {
                    background-color: var(--button-hover-background-color);
                    transform: scale(1.05);
                }
 
                .login-student-register-link {
                    margin-top: 40px;
                    font-size: 1rem;
                    color: var(--text-color);
                    text-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
                }
 
                .login-student-register-link a {
                    color: var(--primary-color);
                    text-decoration: none;
                }
 
                .login-student-register-link a:hover {
                    text-decoration: underline;
                }
 
                @media (max-width: 768px) {
                    .login-student-container {
                        width: 80%;
                        height: auto;
                        padding: 20px;
                    }
 
                    .login-student-input,
                    .login-student-submit {
                        max-width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};
 
export default LoginStudent;