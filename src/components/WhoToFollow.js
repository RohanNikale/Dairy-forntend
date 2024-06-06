import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './WhoToFollow.css';

function WhoToFollow() {
  const [profiles, setProfiles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const token = Cookies.get('authToken');

  useEffect(() => {
    fetchProfiles(currentPage);
  }, [currentPage]);

  const fetchProfiles = async (page) => {
    try {
      const response = await axios.get('http://localhost:5000/api/follow/profiles-to-follow', {
        headers: {
          'token': `${token}`
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
  };

  const handleFollowUnfollow = async (profileId, isFollowed) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/follow/${profileId}/follow`, {}, {
        headers: {
          'token': `${token}`
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
            <div className="profile-pic" style={{ backgroundColor: profile.picColor || 'gray' }}></div>
            <div className="profile-info">
              <span className="display-name">{profile.displayName}</span>
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
