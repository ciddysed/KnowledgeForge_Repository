import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <h2>Are you a Student or Tutor?</h2>
            <button onClick={() => navigate('/loginStudent')} className="login-button fade-in">
                Login as Student
            </button>
            <button onClick={() => navigate('/loginTutor')} className="login-button fade-in">
                Login as Tutor
            </button>
            <style>{`
                .login-page {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 50vh;
                    color: black;
                    font-family: 'Arial', sans-serif;
                    text-align: center;
                }

                .login-page h2 {
                    margin-bottom: 20px;
                    font-size: 2rem;
                    animation: fadeIn 2s ease-in-out;
                }

                .login-button {
                    padding: 15px 30px;
                    margin: 10px;
                    font-size: 1rem;
                    font-weight: bold;
                    color: black;
                    background: rgba(255, 255, 255, 0.2);
                    border: 2px solid blue;
                    border-radius: 30px;
                    cursor: pointer;
                    transition: all 0.3s ease-in-out;
                    animation: fadeIn 2s ease-in-out;
                    animation-delay: 0.1s; /* Staggered fade for buttons */
                }

                .login-button:hover {
                    background: white;
                    color: blue;
                    transform: scale(1.2);
                }

                .login-button:active {
                    transform: scale(1.05);
                }

                /* Fade-in animation */
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
