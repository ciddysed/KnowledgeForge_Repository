import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for navigation
import Logo from "../Assets/logo.png";
import { FaSignOutAlt, FaUser } from "react-icons/fa";
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
  const navigate = useNavigate(); // Hook for navigation

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
    navigate('/loginTutor');
  };

  return (
    <nav>
      <div className="nav-logo-container fancy-logo">
        <Link to="/tutorHome">
          <img src={Logo} alt="KnowledgeForge Logo" className="nav-logo" />
        </Link>
      </div>
      <div className="navbarStudent-links-container">
        <Link to="/tutorHome">Home</Link>
        <Link to="/profile">
          <FaUser className="profile-icon" /> {/* Profile icon */}
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

      .profile-icon {
        font-size: 1.5rem;
        color: black;
        margin-top: 4px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
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
        transform: scale(1.5);
      }

      .nav-logo {
        width: 200px;
        height: auto;
        padding: 5px;
      }

        .nav-logo-container {
          max-width: 140px;
          margin-left: 20px; /* Add slight margin for spacing from the left */
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
      `}

      </style>
    </nav>
  );
};

export default NavbarStudent;