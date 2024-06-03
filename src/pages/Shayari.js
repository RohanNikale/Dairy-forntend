import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import ShayariPost from '../components/ShayariPost';
import { MyContext } from '../MyContext';

function PostList() {
    const { backend_url } = useContext(MyContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Fetch post data
        const fetchPosts = async () => {
            try {
                const response = await axios.get(`${backend_url}/api/post/getPostsbytype/shayari?page=1&limit=10`); // Assuming your API endpoint for fetching posts is '/api/posts'
                setPosts(response.data.posts); // Assuming the response contains an array of posts under 'posts' key
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div>
            {/* Render ShayariPost components for each post */}
            {posts.length === 0 ? (
                <h1>No posts</h1>
            ) : (
                posts.map(post => (
                    <ShayariPost key={post._id} post={post} />
                ))
            )}
        </div>
    );
}

export default PostList;
