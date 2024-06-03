import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { MyContext } from '../MyContext';

export default function PostList(props) {
  const {backend_url}=useContext(MyContext)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
      // Fetch post data
      const fetchPosts = async () => {
          try {
              const response = await axios.get(`${backend_url}/api/post/getPostsbytype/${props.type}?page=1&limit=10`); // Assuming your API endpoint for fetching posts is '/api/posts'
              setPosts(response.data.posts); // Assuming the response contains an array of posts under 'posts' key
          } catch (error) {
              console.error('Error fetching posts:', error);
          }
      };

      fetchPosts();
  }, []);

  return (
    <div>
      {posts.length > 0 ? (
        posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))
      ) : (
        <h1>No posts</h1>
      )}
    </div>
  );
}
