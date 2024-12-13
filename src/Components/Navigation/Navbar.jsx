/* eslint-disable jsx-a11y/anchor-is-valid */
import CommentRoundedIcon from "@mui/icons-material/CommentRounded";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import React, { useState } from "react";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Link } from 'react-router-dom';
import Logo from '../../Assets/logo.png'; // Update the path to the correct location of the logo image

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuOptions = [
    { text: "Home", icon: <HomeIcon /> },
    { text: "About", icon: <InfoIcon /> },
    { text: "Testimonials", icon: <CommentRoundedIcon /> },
    { text: "Contact", icon: <PhoneRoundedIcon /> },
  ];

  return (
    <nav>
      <div className="nav-logo-container fancy-logo">
        <Link to="/">
          <img src={Logo} alt="KnowledgeForge Logo" className="nav-logo" />
        </Link>
      </div>
      <div className="navbar-links-container">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/work">Work</Link>
        <Link to="/testimonial">Testimonials</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-height: 90px;
      }
      .nav-logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px;
      }

      .navbar-links-container a {
        margin-right: 6rem;
        text-decoration: none;
        color: white;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .fancy-logo {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .fancy-logo:hover {
        transform: scale(1.5);
      }

      .nav-logo {
        width: 150px;
        height: auto;
        padding: 5px;
      }
      `}</style>
    </nav>
  );
};

export default Navbar;