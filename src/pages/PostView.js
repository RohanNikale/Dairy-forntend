import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';
import { MyContext } from '../MyContext';
import CommentList from '../components/CommentList';
import userImage from '../components/user.png';

export default function PostView() {
  const { backend_url, userData } = useContext(MyContext);
  const { postid } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const userId = userData._id;
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    if (post) {
      setLikesCount(post.likesCount);
      // Check if the user has liked the post
      axios.get(`${backend_url}/api/like/post/${post._id}/likeStatus`, {
        headers: { token: authToken }
      }).then(response => {
        setLiked(response.data.liked);
      }).catch(error => {
        console.error('Error checking like status:', error);
      });
    }
  }, [post, backend_url, authToken]);

  const handleLikeClick = async () => {
    if (!authToken) {
      navigate('/SignupLogin');
      return;
    }

    try {
      const response = await axios.post(
        `${backend_url}/api/like/post/${post._id}/like`,
        {},
        {
          headers: { token: authToken }
        }
      );

      if (response.data.liked) {
        setLikesCount(likesCount + 1);
        setLiked(true);
      } else {
        setLikesCount(likesCount - 1);
        setLiked(false);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/post/getpost/${postid}`, {
          headers: { token: authToken }
        });
        setPost(response.data.post);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postid, backend_url, authToken]);

  const fetchFirstPageComments = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/comments`, {
        headers: { token: authToken },
        params: {
          postId: postid,
          page: 1,
          limit: 4,
        },
      });

      const newComments = response.data.comments || [];
      setComments(newComments);
      setHasMore(newComments.length === 4);
      setPage(2);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchNextPageComments = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/comments`, {
        headers: { token: authToken },
        params: {
          postId: postid,
          page,
          limit: 4,
        },
      });

      const newComments = response.data.comments || [];
      setComments((prevComments) => [...prevComments, ...newComments]);
      setHasMore(newComments.length === 4);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backend_url}/api/comments`, { postId: postid, content: commentText }, {
        headers: { token: authToken }
      });
      setCommentText('');
      setPage(1);
      fetchFirstPageComments();
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  useEffect(() => {
    fetchFirstPageComments();
  }, [postid, backend_url, authToken]);

  if (!post) return <h1>Loading...</h1>;

  return (
    <div>
      <div className="container">
        <img src={userImage} alt="user" width={39} /> &nbsp;&nbsp; <b>{post.author}</b> @{post.username}
        <div className="post">
          <p><div dangerouslySetInnerHTML={{ __html: post.content }} /></p>
          <div className="tags">
            <span style={{ fontSize: '1rem' }}>
              <i 
                className={`fa-${liked ? 'solid' : 'regular'} fa-heart`}
                onClick={handleLikeClick}
              ></i> {likesCount} &nbsp;&nbsp;&nbsp;
              <i className="fa-solid fa-share"></i>&nbsp;{post.shares}
            </span>
          </div>
        </div>
      </div>
      <div>
        <div style={{ margin: '0 10px' }}>
          <form onSubmit={handleCommentSubmit}>
            <div className="form-floating">
              <textarea
                className="form-control"
                placeholder="Leave a comment here"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
              <label htmlFor="floatingTextarea">Comments</label>
              <button className="follow-button followed" style={{ marginTop: '7px' }} type="submit">Post</button>
              <br />
            </div>
          </form>
          <br />
          <h4>Comments ({comments.length})</h4>
          <InfiniteScroll
            dataLength={comments.length}
            next={fetchNextPageComments}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p style={{ textAlign: 'center' }}>No more comments</p>}
          >
            <CommentList comments={comments} postId={postid} setComments={setComments} />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
