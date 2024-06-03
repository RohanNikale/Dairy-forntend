import React, { useContext, useState, useEffect } from 'react';
import './ShayariPost.css'; // Make sure to create and import a CSS file for styling
import userImage from './user.png'; // renamed user to userImage to avoid conflict with import user
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MyContext } from '../MyContext';

const ShayariPost = ({ post }) => {
  const { backend_url, userData } = useContext(MyContext);
  const userId = userData._id;
  const authToken = Cookies.get('authToken');
  const [likes, setLikes] = useState(post.likes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Check if the user has already liked the post
    console.log(userId)
    if (userId) {
      setLiked(likes.some(like => like.userId === userId));
    }
  }, [likes, userId]);

  const handleToggleLike = async () => {
    try {
      const response = await axios.post(
        `${backend_url}/api/post/${post._id}/like`,
        {},
        {
          headers: {
            token: authToken
          }
        }
      );

      if (response.data.message === 'Post liked') {
        setLikes([...likes, { userId, name: userData.name, username: userData.username }]);
        setLiked(true);
      } else if (response.data.message === 'Post unliked') {
        setLikes(likes.filter(like => like.userId !== userId));
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
            ></i> {likes.length}
            &nbsp;&nbsp;&nbsp;
            <i className="fa-solid fa-share"></i>&nbsp;{post.shares}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShayariPost;
