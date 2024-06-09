// components/CommentList.js

import React, { useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReplyList from './ReplyList';
import userImage from '../components/user.png';
import { MyContext } from '../MyContext';
import './Comment.css';

const CommentList = ({ comments, postId, setComments }) => {
  const [showReplies, setShowReplies] = useState({});
  const authToken = Cookies.get('authToken');
  const { backend_url, userData} = useContext(MyContext);



  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`${backend_url}/api/comments/${commentId}`, {
        headers: { token: authToken }
      });
      setComments(prevComments => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const toggleReplies = (commentId) => {
    setShowReplies(prevState => ({ ...prevState, [commentId]: !prevState[commentId] }));
  };

  return (
    <div>
      {comments.map(comment => (
        <div key={comment._id} className="commentCard container">
          <div className="comment">
            <img src={userImage} alt="user" width={30} /> &nbsp;&nbsp; <b>{comment.userId.name}</b> @{comment.userId.username}
            <p style={{ padding: '6px 40px', wordWrap: "break-word", minWidth: "300px" }}>{comment.content}</p>
            <button className="follow-button" onClick={() => toggleReplies(comment._id)}>
              {showReplies[comment._id] ? 'Hide Replies' : 'reply'}
            </button>
            {comment.userId._id===userData._id?
            <button className="follow-button" style={{ marginLeft: "10px" }} onClick={() => handleDeleteComment(comment._id)}>
              <i className="fa-solid fa-trash"></i>
            </button>:null
            }
          </div>

          {showReplies[comment._id] && (
            <ReplyList
              commentId={comment._id}
              setComments={setComments}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
