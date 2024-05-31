import React from 'react'
import './WhoToFollow.css'


  
  function followUnfollow(button) {
    // Define the function logic to follow/unfollow
    if (button.classList.contains('followed')) {
      button.classList.remove('followed');
      button.textContent = 'Follow';
    } else {
      button.classList.add('followed');
      button.textContent = 'Unfollow';
    }
  }
export default function WhoToFollow() {
  return (
    <div>
              <div className="card">
          <h1 className="card-title">Who to follow</h1>
          <span className="divider"></span>
          <div className="profile">
            <div className="profile-pic" style={{ backgroundColor: 'pink' }}></div>
            <div className="profile-info">
              <span className="display-name">Riyana Gueco</span>
              <span className="username">RiyanaGueco</span>
            </div>
            <button className="follow-button followed" onClick={(e) => followUnfollow(e.target)}>Unfollow</button>
          </div>
          <span className="divider"></span>
          <div className="profile">
            <div className="profile-pic" style={{ backgroundColor: 'palegoldenrod' }}></div>
            <div className="profile-info">
              <span className="display-name">Some Company</span>
              <span className="username">Nice</span>
            </div>
            <button className="follow-button" onClick={(e) => followUnfollow(e.target)}>Follow</button>
          </div>
          <span className="divider"></span>
          <div className="profile">
            <div className="profile-pic" style={{ backgroundColor: 'powderblue' }}></div>
            <div className="profile-info">
              <span className="display-name">Short</span>
              <span className="username">shortdn</span>
            </div>
            <button className="follow-button" onClick={(e) => followUnfollow(e.target)}>Follow</button>
          </div>
          <span className="divider"></span>
          <a href="#" className="show-more">Show more</a>
        </div>
      </div>
  )
}
