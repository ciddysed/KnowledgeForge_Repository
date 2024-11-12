import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import Link and useNavigate

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <h2>Are you a Student or Tutor?</h2>
            <button onClick={() => navigate('/loginStudent')} className="login-button">Login as Student</button>
            <button onClick={() => navigate('/LoginTutor')} className="login-button">Login as Tutor</button>
        </div>
    );
};

export default LoginPage;