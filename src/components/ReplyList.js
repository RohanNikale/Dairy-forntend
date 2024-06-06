import React from 'react';
import userImage from '../components/user.png';
import './Comment.css'
const ReplyList = ({ replies, commentId, loadMoreReplies }) => {
  return (
    <div>
      {replies.map(reply => (
        <div key={reply._id} className="replayCard">
          <img src={userImage} alt="user" width={30} /> &nbsp;&nbsp; <b>{reply.userId.name}</b> @{reply.userId.username}
          <p style={{ padding: '6px 40px' }}>{reply.content}</p>
        </div>
      ))}
      <button className="follow-button" onClick={() => loadMoreReplies(commentId)}>Load More Replies</button>
    </div>
  );
};

export default ReplyList;
