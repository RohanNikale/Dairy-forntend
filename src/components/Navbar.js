import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file
import { MyContext } from '../MyContext';
import logo from './logo1.png';

const Header = () => {
  const { backend_url, isLoggedIn, Logout } = useContext(MyContext);
  const [menuActive, setMenuActive] = useState(false);
  const location = useLocation();

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
          <Link to="/" className="brand">
            <img src={logo} alt="Logo" width={200} />
          </Link>
          <div className="search">
            <form className="search-form">
              <input
                type="text"
                name="search"
                className="search-input"
                placeholder="Search for Destinations"
                autoFocus
              />
              <button type="submit" className="search-submit" disabled>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
          <div className={`menu ${menuActive ? 'is-active' : ''}`} id="menu">
            <ul className="menu-inner">
              <li className="menu-item">
                <Link to="" className="menu-link" onClick={closeMenu}>Support</Link>
              </li>
              <li className="menu-item">
                <Link to="" className="menu-link" onClick={closeMenu}>Listing</Link>
              </li>
              {!isLoggedIn ? (
                <Link to="/SignupLogin">
                  <button className="follow-button">Login/Signup</button>
                </Link>
              ) : (
                <button className="follow-button" onClick={() => {Logout();}}>Logout</button>
              )}
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
      <br />
      <br />
      <div className='d-flex align-items-center justify-content-center'>
        <div className="secondNavbar">
          <ul>
            <Link to='/'><li className={location.pathname === '/' ? 'active' : ''}>शेर</li></Link>
            <Link to='/gazal'><li className={location.pathname === '/gazal' ? 'active' : ''}>ग़ज़ल</li></Link>
            <Link to='/geet'><li className={location.pathname === '/geet' ? 'active' : ''}>गीत</li></Link>
            <Link to='/nazm'><li className={location.pathname === '/nazm' ? 'active' : ''}>नज़्म</li></Link>
          </ul>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Header;
