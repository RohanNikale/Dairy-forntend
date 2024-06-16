import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './WhoToFollow.css';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import userpic from './user.png'
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height
  };
}
function WhoToFollow() {
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { backend_url } = useContext(MyContext);
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get('authToken');

  const fetchProfiles = useCallback(async (page) => {
    if (!(windowDimensions.width <= 992)) {

      try {
        const response = await axios.get(`${backend_url}/api/follow/profiles-to-follow`, {
          headers: {
            'token': token
          },
          params: {
            page: page,
            limit: 4
          }
        });

        if (page === 1) {
          setProfiles(response.data.profiles);
        } else {
          setProfiles(prevProfiles => [...prevProfiles, ...response.data.profiles]);
        }
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    }
  }, [backend_url, token]);

  useEffect(() => {
    fetchProfiles(currentPage);
  }, [currentPage, fetchProfiles]);

  const handleFollowUnfollow = async (profileId, isFollowed) => {
    if (!token) {
      navigate('/SignupLogin'); // Redirect to the login page if not authenticated
      return;
    }

    try {
      const response = await axios.post(`${backend_url}/api/follow/${profileId}/follow`, {}, {
        headers: {
          'token': token
        }
      });

      if (response.status === 200) {
        setProfiles(profiles.map(profile =>
          profile.id === profileId ? { ...profile, followed: !isFollowed } : profile
        ));
      } else {
        console.error('Error following/unfollowing profile:', response.statusText);
      }
    } catch (error) {
      console.error('Error following/unfollowing profile:', error);
    }
  };

  const handleShowMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  return (
    <div>
      <div className="card">
        <h1 className="card-title">Who to follow</h1>
        <span className="divider"></span>
        {profiles.map(profile => (
          <div key={profile.id} className="profile">
            <img src={userpic} alt="user" width={39} /> &nbsp;
            <div className="profile-info">
              <Link style={{ color: "black", textDecoration: "none" }} to={`/profile/${profile.id}`}>
                <span className="display-name">{profile.displayName}</span>
              </Link>
              <span className="username">{profile.username}</span>
            </div>
            <button
              className={`follow-button ${profile.followed ? 'followed' : ''}`}
              onClick={() => handleFollowUnfollow(profile.id, profile.followed)}
            >
              {profile.followed ? 'Unfollow' : 'Follow'}
            </button>
            <span className="divider"></span>
          </div>
        ))}
        {currentPage < totalPages && (
          <button onClick={handleShowMore} className="show-more">Show more</button>
        )}
      </div>
    </div>
  );
}

export default WhoToFollow;
