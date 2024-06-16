import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MyContext } from '../MyContext';
import './BottomNav.css';

export default function BottomNav() {
  const { userData, isLoggedIn, unreadNotifications } = useContext(MyContext);
  const location = useLocation();

  return (
    <div>
      <nav className="navbar navbar-light bg-white border navbar-expand fixed-bottom">
        <ul className="navbar-nav nav-justified w-100">
          <li className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
            <Link className="nav-link position-relative" to="/">
              <div className="nav-icon"><i className="fa-solid fa-house"></i></div>Home
            </Link>
          </li>
          <li className={`nav-item ${location.pathname === '/notification' ? 'active' : ''}`}>
            <Link className="nav-link position-relative" to="/notification">
              <div className="nav-icon"><i className="fa-solid fa-bell"></i>{unreadNotifications}</div>Notification
            </Link>
          </li>
          <li className={`nav-item ${location.pathname === `/profile/${userData._id}` ? 'active' : ''}`}>
            <Link className="nav-link position-relative" to={isLoggedIn ? `/profile/${userData._id}` : '/SignupLogin'}>
              <div className="nav-icon"><i className="fa-solid fa-user"></i></div>{isLoggedIn ? "Me" : "Login"}
            </Link>
          </li>
        </ul>
      </nav>
      {isLoggedIn ?
        <div id="mybutton">
          <Link to="/post-form">
            <button className="feedback">+</button>
          </Link>
        </div>
        : ""}
    </div>
  );
}
