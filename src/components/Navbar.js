import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file
import { MyContext } from '../MyContext';
import logo from './logoMain.png';
import axios from 'axios'; // Import Axios
import _ from 'lodash'; // Import lodash for debounce function
import userImage from './user.png';

const Header = () => {
  const { isLoggedIn, Logout, backend_url } = useContext(MyContext);
  const [menuActive, setMenuActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const closeMenu = () => {
    setMenuActive(false);
  };

  const isProfilePage = location.pathname.startsWith('/profile');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }

      try {
        const response = await axios.get(`${backend_url}/api/user/search?query=${searchQuery}`);
        setSearchResults(response.data.users);
      } catch (error) {
        console.error('Error searching:', error);
      }
    };

    const debouncedFetch = _.debounce(fetchSearchResults, 300);
    debouncedFetch();

    return () => {
      debouncedFetch.cancel();
    };
  }, [searchQuery, backend_url]);

  const handleResultClick = () => {
    setSearchQuery('');
    closeMenu();
  };

  return (
    <div className="navbar-main">
      <header className="header" id="header">
        <nav className="navbar container">
          <Link to="/" className="brand">
            <img src={logo} alt="Logo" width={200} />
          </Link>
          <div className="search">
            <form className="search-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                name="search"
                className="search-input"
                placeholder="Search for Destinations"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="search-results">
                  <ul>
                    {searchResults.map(user => (
                      <Link key={user._id} style={{ color: "black", textDecoration: "none" }} to={`/profile/${user._id}`} onClick={handleResultClick}>
                        <img src={userImage} alt="user" width={39} /> &nbsp;&nbsp;&nbsp; <b>{user.name}</b> @{user.username}
                      </Link>
                    ))}
                  </ul>
                </div>
              )}
              <button type="submit" className="search-submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
          <div className={`menu ${menuActive ? 'is-active' : ''}`} id="menu">
            <ul className="menu-inner">
              {/* <li className="menu-item">
                <Link to="" className="menu-link" onClick={closeMenu}>Support</Link>
              </li>
              <li className="menu-item">
                <Link to="" className="menu-link" onClick={closeMenu}>Listing</Link>
              </li> */}
              {!isLoggedIn ? (
                <Link to="/SignupLogin">
                  <button className="follow-button">Login/Signup</button>
                </Link>
              ) : (
                <button className="follow-button" onClick={() => { Logout(); navigate('/SignupLogin'); }}>Logout</button>
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
      <div>

        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        {location.pathname==="/post-form"?"":
        <div>
        <br />
        {!isProfilePage && (
          <div>
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
        )}
        </div>
        }
      </div>
    </div>
  );
};

export default Header;
