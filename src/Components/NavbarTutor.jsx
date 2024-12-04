import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom'; // useNavigate for navigation
import Logo from "../Assets/logo.png";
import { FaSignOutAlt } from "react-icons/fa";
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
      <div className="nav-logo-container">
        <Link to="/tutorHome">
          <img src={Logo} alt="KnowledgeForge Logo" />
        </Link>
      </div>
      <div className="navbarStudent-links-container">
        <Link to="/tutorHome">Home</Link>
        <Link to="#">Profile</Link>
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
    </nav>
  );
};

export default NavbarStudent;