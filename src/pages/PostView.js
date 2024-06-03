import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { MyContext } from '../MyContext';
import CommentList from '../components/CommentList';
import userImage from '../components/user.png';

export default function PostView() {
  const { backend_url, userData } = useContext(MyContext);
  const { postid } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [page, setPage] = useState(1);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const userId = userData._id;
  const authToken = Cookies.get('authToken');

  useEffect(() => {
    if (post) {
      setLikes(post.likes);
      setLiked(post.likes.some(like => like.userId === userId));
    }
  }, [post, userId]);

  const handleToggleLike = async () => {
    try {
      const response = await axios.post(
        `${backend_url}/api/post/${post._id}/like`,
        {},
        {
          headers: { token: authToken }
        }
      );

      if (response.data.message === 'Post liked') {
        setLikes([...likes, { userId, name: Cookies.get('userName'), username: Cookies.get('userUsername') }]);
        setLiked(true);
      } else if (response.data.message === 'Post unliked') {
        setLikes(likes.filter(like => like.userId !== userId));
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

    const fetchComments = async () => {
      try {
        const response = await axios.get(`${backend_url}/api/comments?postId=${postid}&page=${page}&limit=4`, {
          headers: { token: authToken }
        });
        if (page === 1) {
          setComments(response.data.comments || []);
        } else {
          setComments(prevComments => [...prevComments, ...(response.data.comments || [])]);
        }
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchPost();
    fetchComments();
  }, [postid, backend_url, page]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backend_url}/api/comments`, { postId: postid, content: commentText }, {
        headers: { token: authToken }
      });
      const response = await axios.get(`${backend_url}/api/comments?postId=${postid}&page=1&limit=4`);
      setComments(response.data.comments);
      setCommentText('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  if (!post) return <h1>Loading...</h1>;

  return (
    <div>
      <div className="container">
        <img src={userImage} alt="user" width={39} /> &nbsp;&nbsp; <b>{post.author}</b> @{post.username}
        <div className="post">
          <p><div dangerouslySetInnerHTML={{ __html: post.content }} /></p>
          <div className="tags">
            <span style={{ fontSize: '1rem' }}>
              <i className={`fa-${liked ? 'solid' : 'regular'} fa-heart`} onClick={handleToggleLike}></i> {likes.length}
              &nbsp;&nbsp;&nbsp;
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
          <CommentList comments={comments} postId={postid} setComments={setComments} />
          <button className="follow-button" onClick={() => setPage(prevPage => prevPage + 1)}>Load More Comments</button>
        </div>
      </div>
    </div>
  );
}
