import React from 'react'
import PostCard from '../components/PostCard'
import { Link } from 'react-router-dom'

function PostList() {
    return (
        <div>
            
            <PostCard />
            <PostCard />
            <PostCard />
        </div>
    )
}

export default PostList
