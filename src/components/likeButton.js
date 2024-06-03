import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const LikeButton = ({ postId, initialLiked }) => {
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);

    const toggleLike = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`/api/posts/${postId}/like-toggle`);
            setLiked(!liked);
        } catch (error) {
            console.error('Error toggling like status:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button onClick={toggleLike} disabled={loading} style={{ background: 'none', border: 'none' }}>
            {liked ? <FaHeart color="red" size={24} /> : <FaRegHeart size={24} />}
        </button>
    );
};

export default LikeButton;
