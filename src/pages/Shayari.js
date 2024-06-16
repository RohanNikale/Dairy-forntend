import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import ShayariPost from '../components/ShayariPost';
import { MyContext } from '../MyContext';
import Cookies from 'js-cookie';
import loader from '../components/loader.gif';

function PostList() {
  const { backend_url, userData } = useContext(MyContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const authToken = Cookies.get('authToken');

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${backend_url}/api/post/recommended/?type=shayari&page=${page}&limit=4`, {
        headers: { token: authToken }
      });
      const newPosts = response.data.posts;
      // Check if newPosts is an array and contains the expected posts
      if (Array.isArray(newPosts)) {
        setPosts(prevPosts => [...prevPosts, ...newPosts.filter(post => !prevPosts.some(p => p._id === post._id))]);
        setHasMore(newPosts.length > 0);
      } else {
        console.error('Unexpected response format:', response.data);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setHasMore(false);
    }
  };

  useEffect(() => {
    document.title = 'QalaamKaar - shayari'
    fetchPosts();
  }, [page]);

  const fetchMoreData = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchMoreData}
      hasMore={hasMore}
      loader={<><center>
        <img src={loader} alt=""width={39} />
        </center>
        </>}
      endMessage={<p style={{ textAlign: 'center' }}>No more posts</p>}
    >
      {posts.length === 0 ? (
        <h1>No posts</h1>
      ) : (
        posts.map(post => (
          <ShayariPost key={post._id} post={post} />
        ))
      )}
    </InfiniteScroll>
  );
}

export default PostList;
