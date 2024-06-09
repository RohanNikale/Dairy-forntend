import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MyContext } from '../MyContext';
import './Notifications.css';
import { Link } from 'react-router-dom';
import userImage from '../components/user.png'; // Ensure this image is in the correct path

function Notifications() {
  const {markAsRead,notifications } = useContext(MyContext);

  return (
    <div className="notifications">
      <h2>Notifications</h2>

      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        <ul>
          {notifications.map(notification => (
            <li key={notification._id} className={notification.read ? 'read' : 'unread'}>
              <div className='message'>
                <p><b><Link to={`/profile/${notification.fromUser._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                  <img src={userImage} alt="user" width={39} /> &nbsp;{`${notification.fromUser.username}`}
                </Link>
                </b> &nbsp;&nbsp;{`${notification.message}`} &nbsp;{notification.type === "new_like" ? <Link style={{ textDecoration: 'none', color: '#e0245e' }} to={`/post/${notification.postId}`}>View Post</Link> : ""}</p>
              </div>
              {!notification.read && (
                <button onClick={() => markAsRead(notification._id)}>Mark as read</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notifications;
