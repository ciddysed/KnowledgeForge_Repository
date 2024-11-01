import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => setMenuActive(!menuActive);

  return (
    <nav className="navbar">
      <h1 className="navbar-logo">KnowledgeForge</h1>
      <div className="hamburger" onClick={toggleMenu}>
        <span className={`bar ${menuActive ? 'active' : ''}`}></span>
        <span className={`bar ${menuActive ? 'active' : ''}`}></span>
        <span className={`bar ${menuActive ? 'active' : ''}`}></span>
      </div>
      <ul className={`navbar-menu ${menuActive ? 'active' : ''}`}>
        <li className="navbar-item">
          <Link to="/" className="navbar-link" onClick={toggleMenu}>Home</Link>
        </li>
        <li className="navbar-item">
          <Link to="/about" className="navbar-link" onClick={toggleMenu}>About</Link>
        </li>
        <li className="navbar-item">
          <Link to="/contact" className="navbar-link" onClick={toggleMenu}>Contact</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
