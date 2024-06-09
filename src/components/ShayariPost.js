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
  const [expanded, setExpanded] = useState(false);

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post!',
        text: post.content,
        url: `${window.location.origin}/post/${post._id}`
      }).then(() => {
        console.log('Thanks for sharing!');
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      alert('Sharing is not supported on this browser.');
    }
  };

  const handleReadMore = () => {
    setExpanded(true);
  };

  const truncatedContent = post.content.length > 142 ? post.content.substring(0, 160) + '...' : post.content;

  return (
    <div className="container card-post">
      <Link style={{ color: "black", textDecoration: "none" }} to={`/profile/${post.userId._id}`}>
        <img src={userImage} alt="user" width={39} /> &nbsp;&nbsp; <b>{post.userId.name}</b> @{post.userId.username}
      </Link>
      <div className="post">
        <Link to={`/post/${post._id}`}>
          <div>
            {expanded ? (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div>
                <div dangerouslySetInnerHTML={{ __html: truncatedContent }} />
                {post.content.length > 142 && (
                  <span onClick={handleReadMore} style={{ color: '#e0245e', cursor: 'pointer' }}>
                    Read more
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
        <div className="tags">
          <span style={{ fontSize: '1rem' }}>
            <i
              className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}
              onClick={handleToggleLike}
              style={{ cursor: 'pointer' }}
            ></i> {likes}
            &nbsp;&nbsp;&nbsp;
            <i
              className="fa-solid fa-share"
              onClick={handleShare}
              style={{ cursor: 'pointer' }}
            ></i>&nbsp;{post.shares}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShayariPost;
