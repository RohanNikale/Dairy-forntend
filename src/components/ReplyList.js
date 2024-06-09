import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import userImage from '../components/user.png';
import { MyContext } from '../MyContext';
import './Comment.css';

const ReplyList = ({ commentId, setComments }) => {
  const [replies, setReplies] = useState([]);
  const [repliesPage, setRepliesPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const authToken = Cookies.get('authToken');
  const { backend_url, userData } = useContext(MyContext);

  useEffect(() => {
    fetchReplies();
  }, [commentId]);

  const fetchReplies = async (page = 1) => {
    try {
      const response = await axios.get(`${backend_url}/api/comments/${commentId}/replies?page=${page}&limit=4`);
      const newReplies = response.data.replies;
      setReplies(prevReplies => (page === 1 ? newReplies : [...prevReplies, ...newReplies]));
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const loadMoreReplies = () => {
    const nextPage = repliesPage + 1;
    fetchReplies(nextPage);
    setRepliesPage(nextPage);
  };

  const handleDeleteReply = async (replyId) => {
    try {
      await axios.delete(`${backend_url}/api/comments/${commentId}/replies/${replyId}`, {
        headers: { token: authToken }
      });
      setReplies(prevReplies => prevReplies.filter(reply => reply._id !== replyId));
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const replyText = e.target.elements.replyText.value;
    e.target.elements.replyText.value = "";
    try {
      await axios.post(`${backend_url}/api/comments/${commentId}/replies`, { content: replyText }, {
        headers: { token: authToken }
      });
      fetchReplies(); // Fetch the replies again to update the list
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleReplySubmit}>
        <input type="text" name="replyText" placeholder="Type your reply" style={{ margin: '16px' }} required />
        <button type="submit" className="follow-button followed">Reply</button>
      </form>
      {replies.map(reply => (
        <div key={reply._id} className="replyCard">
          <img src={userImage} alt="user" width={30} /> &nbsp;&nbsp; <b>{reply.userId.name}</b> @{reply.userId.username}
          <div className="content">
            <p style={{ padding: '6px 40px', wordWrap: "break-word", minWidth: "300px" }}>{reply.content}</p>
          </div>
          {reply.userId._id === userData._id ?
            <button className="follow-button" onClick={() => handleDeleteReply(reply._id)}>
              <i className="fa-solid fa-trash"></i>
            </button> : null}
        </div>
      ))}
      <br />
      {hasMore && <button className="follow-button" onClick={loadMoreReplies}>Load More Replies</button>}
    </div>
  );
};

export default ReplyList;
