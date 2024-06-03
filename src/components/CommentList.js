import React, { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReplyList from './ReplyList';
import userImage from '../components/user.png';
import { MyContext } from '../MyContext';
import './Comment.css'
const CommentList = ({ comments, postId, setComments }) => {
  const [showReplies, setShowReplies] = useState({});
  const [repliesPage, setRepliesPage] = useState({});
  const authToken = Cookies.get('authToken');
  const { backend_url, userData } = useContext(MyContext);
  const handleReplySubmit = async (commentId, replyText) => {
    try {
      await axios.post(`${backend_url}/api/comments/${commentId}/replies`, { content: replyText }, {
        headers: { token: authToken }
      });
      const response = await axios.get(`${backend_url}/api/comments/${commentId}/replies?page=1&limit=4`);
      const updatedReplies = response.data.replies;
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
      setComments(updatedComments);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const toggleReplies = async (commentId) => {
    try {
      const response = await axios.get(`${backend_url}/api/comments/${commentId}/replies?page=1&limit=4`);
      const updatedReplies = response.data.replies;
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, replies: updatedReplies };
        }
        return comment;
      });
      setShowReplies(prevState => ({ ...prevState, [commentId]: !prevState[commentId] }));
      setComments(updatedComments);
      setRepliesPage(prevState => ({ ...prevState, [commentId]: 1 }));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const loadMoreReplies = async (commentId) => {
    try {
      const nextPage = (repliesPage[commentId] || 1) + 1;
      const response = await axios.get(`${backend_url}/api/comments/${commentId}/replies?page=${nextPage}&limit=4`);
      const newReplies = response.data.replies;
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return { ...comment, replies: [...comment.replies, ...newReplies] };
        }
        return comment;
      });
      setComments(updatedComments);
      setRepliesPage(prevState => ({ ...prevState, [commentId]: nextPage }));
    } catch (error) {
      console.error('Error loading more replies:', error);
    }
  };

  return (
    <div>
      {comments.map(comment => (
        <div key={comment._id} className="commentCard">
          <div className="comment">
            <img src={userImage} alt="user" width={30} /> &nbsp;&nbsp; <b>{comment.name}</b> @{comment.username}
            <p style={{ padding: '6px 40px' }}>{comment.content}</p>
            <button className="follow-button" onClick={() => toggleReplies(comment._id)}>
              {showReplies[comment._id] ? 'Hide Replies' : 'Show Replies'}
            </button>
          </div>
            <form onSubmit={(e) => {
                e.preventDefault();
                const replyText = e.target.elements.replyText.value;
                e.target.elements.replyText.value = "";
                handleReplySubmit(comment._id, replyText);
            }}>
                <input type="text" name="replyText" placeholder="Type your reply" style={{ margin: '16px' }} required />
                <button type="submit" className="follow-button followed">Reply</button>
            </form>
            {showReplies[comment._id] && (
                <ReplyList
                replies={comment.replies}
                commentId={comment._id}
                loadMoreReplies={loadMoreReplies}
                />
            )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
