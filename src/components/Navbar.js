import React, { useState } from 'react';
import './Navbar.css'; // Import the CSS file
import { Link } from 'react-router-dom';
const Header = () => {
  const [menuActive, setMenuActive] = useState(false);

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

  return (
    <div className="navbar-main">

      <header className="header" id="header">
        <nav className="navbar container">
          <Link to="/" className="brand">word diary</Link>
          <div className="search">
            <form className="search-form">
              <input type="text" name="search" className="search-input" placeholder="Search for Destinations" autoFocus />
              <button type="submit" className="search-submit" disabled><i className="bx bx-search"></i></button>
            </form>
          </div>
          <div className={`menu ${menuActive ? 'is-active' : ''}`} id="menu">
            <ul className="menu-inner">
              <li className="menu-item"><Link to=">#" className="menu-link" onClick={closeMenu}>Listing</Link></li>
              <li className="menu-item"><Link to=">#" className="menu-link" onClick={closeMenu}>Feature</Link></li>
              <li className="menu-item"><Link to=">#" className="menu-link" onClick={closeMenu}>Popular</Link></li>
              <li className="menu-item"><Link to=">#" className="menu-link" onClick={closeMenu}>Support</Link></li>
            </ul>
          </div>
          <div className={`burger ${menuActive ? 'is-active' : ''}`} id="burger" onClick={toggleMenu}>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </div>
        </nav>
      </header>
<br />
<br />
<br />
<br />
<br />  
<br />
<div className='d-flex align-items-center justify-content-center'>

<div className="secondNavbar">
    <ul>
        <li>शेर</li>
        <li>ग़ज़ल</li>
        <li>कविता </li>
        <li>गीत</li>
        <li>नज़्म</li>
    </ul>
        <hr />
</div>
</div>

      
    </div>
  );
};

export default Header;
