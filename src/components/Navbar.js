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
  const [searchResults, setSearchResults] = useState({ users: [], posts: [] }); // State to store search results
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
        setSearchResults({ users: [], posts: [] });
        return;
      }

      try {
        const response = await axios.get(`${backend_url}/api/user/search?query=${searchQuery}`);
        setSearchResults({ users: response.data.users, posts: response.data.posts });
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
                placeholder="Search"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-submit">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
          <div className={`menu ${menuActive ? 'is-active' : ''}`} id="menu">
            <ul className="menu-inner">
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
      <br />
<br />
<br />
<br />
<br />
<br />
<br />
<div className="container">

              {(searchResults.users.length > 0 || searchResults.posts.length > 0) && (
                <div className="search-results">
                  <ul>
                    <h4><b>
                      Post
                      </b>
                      </h4>
                    {searchResults.posts.map(post => (
                      <Link key={post._id} style={{ color: "black", textDecoration: "none" }} to={`/post/${post._id}`} onClick={handleResultClick}>
                        <div>
                          <b>{post.title}</b> by {post.userId.name}
                        </div>
                      </Link>
                    ))}
                    <h4>
                      <br />
                      <b>
                        QalaamKaars
                        </b>
                      </h4>
                    {searchResults.users.map(user => (
                      <Link key={user._id} style={{ color: "black", textDecoration: "none" }} to={`/profile/${user._id}`} onClick={handleResultClick}>
                        <img src={userImage} alt="user" width={39} /> &nbsp;&nbsp;&nbsp; <b>{user.name}</b> @{user.username}
                      </Link>
                    ))}
                  </ul>
                </div>
              )}
              </div>
      <div>

        {location.pathname === "/post-form" ? "" :
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
