import React from 'react';
import user from './user.png';
import './PostCard.css';
import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div>
      <div className="postcard">
        <img src={user} alt="user" width={39} /> &nbsp;&nbsp; <b>{post.author}</b> @{post.username}
        <br />
        <br />
        <Link to={`/post/${post._id}`}>
          <p>
            <b>
              {post.title} <br /><b style={{ color: "red" }}>Read more</b>
            </b>
          </p>
        </Link>
      </div>
    </div>
  );
}
