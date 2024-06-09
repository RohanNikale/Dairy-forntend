import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import userpic from './user.png';
import './PostCard.css';
import { MyContext } from '../MyContext';

export default function PostCard({ post }) {
  const { backend_url } = useContext(MyContext);
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this post!',
        text: post.title,
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

  return (
    <div className='card-post'>
        <Link style={{ color: "black", textDecoration: "none" }} to={`/profile/${post.userId._id}`}>
          <img src={userpic} alt="user" width={39} /> &nbsp;&nbsp; <b>{post.userId.name}</b> @{post.userId.username}
        </Link>
      <div className="postcard">
        <br />
        <br />
        <Link to={`/post/${post._id}`}>
          <p>
            {post.content.length > 100 ? (
              <>
                <div dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) + '...' }} />
                <Link to={`/post/${post._id}`}style={{color:"#e0245e"}}>Read more</Link>
              </>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            )}
          </p>
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
}
