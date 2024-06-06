import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ShayariPost.css'; // Ensure this CSS file is created for styling
import userImage from './user.png'; // Ensure this image is in the correct path
import axios from 'axios';
import Cookies from 'js-cookie';
import { MyContext } from '../MyContext';

const ShayariPost = ({ post }) => {
  const { backend_url, userData } = useContext(MyContext);
  const navigate = useNavigate();
  const authToken = Cookies.get('authToken');

  const [likes, setLikes] = useState(post.likesCount || 0);
  const [liked, setLiked] = useState(post.liked || false);

  const handleToggleLike = async () => {
    if (!authToken) {
      navigate('/SignupLogin');
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}/api/like/post/${post._id}/like`,
        {},
        {
          headers: {
            token: authToken
          }
        }
      );

      if (response.data.liked) {
        setLikes(likes + 1);
        setLiked(true);
      } else {
        setLikes(likes - 1);
        setLiked(false);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  return (
    <div className="container">
      <img src={userImage} alt="user" width={39} /> &nbsp;&nbsp; <b>{post.author}</b> @{post.username}
      <div className="post">
        <Link to={`/post/${post._id}`}>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </Link>
        <div className="tags">
          <span style={{ fontSize: '1rem' }}>
            <i
              className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}
              onClick={handleToggleLike}
              style={{ cursor: 'pointer' }}
            ></i> {likes}
            &nbsp;&nbsp;&nbsp;
            <i className="fa-solid fa-share"></i>&nbsp;{post.shares}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShayariPost;
