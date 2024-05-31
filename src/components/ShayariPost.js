import React from 'react';
import './ShayariPost.css'; // Make sure to create and import a CSS file for styling
import user from './user.png'
import { Link } from 'react-router-dom';
const ShayariPost = () => {
  return (
    <div className="container">
  <img src={user}alt="user" width={39} /> &nbsp;&nbsp; <b>RohanNikale</b> @rohannikale7
      <div className="post">
        <p>उजाले अपनी यादों के हमारे साथ रहने दो<br />
          न जाने किस गली में जिंदगी की शाम हो जाए</p>
        {/* <div className="author">बशीर बद्र</div> */}
        <div className="tags">
          <span>टैग्स:</span> <a href="#">इश्क</a> और <a href="#">6 अन्य</a>
        </div>
      </div>
    </div>
  );
};

export default ShayariPost;
