import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for navigation
import axios from 'axios';
import Logo from "../Assets/logo.png";
import { FaSignOutAlt, FaUser, FaHome } from "react-icons/fa";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

const NavbarStudent = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    // Fetch the logged-in user's profile image from the backend
    const fetchProfileImage = async () => {
      try {
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
        if (loggedInUser && loggedInUser.username) {
          const response = await axios.get(`http://localhost:8080/api/students/profile?username=${loggedInUser.username}`);
          if (response.data && response.data.profileImage) {
            setProfileImage(`http://localhost:8080/${response.data.profileImage}`);
          }
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const menuOptions = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "About", icon: <InfoIcon /> },
    { text: "Testimonials", icon: <CommentRoundedIcon /> },
    { text: "Contact", icon: <PhoneRoundedIcon /> },
  ];

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('loggedInUser');
    // Navigate back to the Home1 page after logout
    navigate('/loginStudent');
  };

  return (
    <nav>
      <div className="nav-logo-container fancy-logo">
        <Link to="/studentHome">
          <img src={Logo} alt="KnowledgeForge Logo" className="nav-logo" />
        </Link>
      </div>
      <div className="navbarStudent-links-container">
        <Link to="/studentHome">
          <FaHome className="home-icon" /> {/* Home icon */}
        </Link>
        <Link to="/studentProfile">
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
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right">
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onKeyDown={() => setOpenMenu(false)}
        >
          <List>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
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

        .navbarStudent-links-container {
          display: flex;
          justify-content: center; /* Align links to the right */
          align-items: center;
          margin-left: auto; /* Automatically push links to the right */
          text-decoration: none;
          color: black;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .navbarStudent-links-container a {
          margin-right: 60px; /* Standard spacing between links */
          text-decoration: none;
          color: black;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .navbarStudent-links-container a:hover {
          color: #00008b; /* Add hover effect */
        }

        .logout-button {
          margin-left: 40px; /* Ensure spacing from links */
        }
      `} </style>
    </nav>
  );
};

export default NavbarStudent;