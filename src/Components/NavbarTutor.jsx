import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from "../Assets/logo.png";
import { FaSignOutAlt, FaUser, FaHome } from "react-icons/fa";
import Swal from 'sweetalert2';

const NavbarTutor = () => {
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the logged-in user's profile image from localStorage
    const storedProfileImage = localStorage.getItem('profileImage');
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    } else {
      // Fetch the logged-in user's profile image from the backend
      const fetchProfileImage = async () => {
        try {
          const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
          if (loggedInUser && loggedInUser.username) {
            const response = await axios.get(`http://localhost:8080/api/tutors/profile?username=${loggedInUser.username}`);
            if (response.data && response.data.profileImage) {
              const profileImageUrl = `http://localhost:8080/${response.data.profileImage}`;
              setProfileImage(profileImageUrl);
              localStorage.setItem('profileImage', profileImageUrl); // Store in localStorage
            }
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      };

      fetchProfileImage();
    }
  }, []);

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      const updatedProfileImage = event.detail.profileImage;
      setProfileImage(updatedProfileImage);
      localStorage.setItem('profileImage', updatedProfileImage);
    };

    window.addEventListener('profileUpdate', handleProfileUpdate);

    return () => {
      window.removeEventListener('profileUpdate', handleProfileUpdate);
    };
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure you want to log out?',
      text: "You'll need to log in again to access your account.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Clear user data from localStorage
        localStorage.removeItem('loggedInUser');
        localStorage.removeItem('profileImage');
        // Navigate back to the login page
        navigate('/loginTutor');
      }
    });
  };

  return (
    <nav>
      <div className="nav-logo-container fancy-logo">
        <Link to="/tutorHome">
          <img src={Logo} alt="KnowledgeForge Logo" className="nav-logo" />
        </Link>
      </div>
      <div className="navbarTutor-links-container">
        <Link to="/tutorHome">
          <FaHome className="home-icon" /> {/* Home icon */}
        </Link>
        <Link to="/tutorProfile">
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="navbar-profile-image" />
          ) : (
            <FaUser className="profile-icon" /> // Fallback to icon if no image
          )}
        </Link>
      </div>
      <button onClick={handleLogout} className="logout-button creative-btn">
        <FaSignOutAlt className="logout-icon" /> {/* Logout icon */}
        Logout
      </button>
      <style>{`
        nav {
          border-radius: 0 0 10px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 75px;
          min-width: 100%;
        }

        .home-icon {
          font-size: 1.8rem;
          color: black;
          margin-top: 4px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .home-icon:hover {
          transform: scale(1.2);
          color: #ffffff;
        }
        
        .profile-icon {
          font-size: 1.5rem;
          color: black;
          margin-top: 4px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .profile-icon:hover {
          transform: scale(1.2);
          color: #ffffff;
        }
        
        .navbar-profile-image {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          margin-top: 4px;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .navbar-profile-image:hover {
          transform: scale(1.2);
        }
        
        .nav-logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fancy-logo {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .fancy-logo:hover {
          transform: scale(1.2);
        }

        .nav-logo {
          width: 200px;
          height: auto;
          padding: 5px;
        }
        
        .nav-logo-container {
          margin-left: 20px; /* Add slight margin for spacing from the left */
          display: inline-block; /* Align it with navbar links */
        }

        .navbarTutor-links-container {
          display: flex;
          justify-content: center; /* Align links to the right */
          align-items: center;
          margin-left: auto; /* Automatically push links to the right */
          text-decoration: none;
          color: black;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .navbarTutor-links-container a {
          margin-right: 60px; /* Standard spacing between links */
          text-decoration: none;
          color: black;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .navbarTutor-links-container a:hover {
          color: #00008b; /* Add hover effect */
        }

        .logout-button {
          margin-left: 40px; /* Ensure spacing from links */
        }
      `}</style>
    </nav>
  );
};

export default NavbarTutor;