import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Modal, Button } from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import './Profile.css';
import userdp from '../components/user.png'; // Import the user profile picture
import { MyContext } from '../MyContext';
import loader from '../components/loader.gif';

export default function Profile() {
    const { backend_url, userData } = useContext(MyContext);
    const { userid } = useParams(); // Get user ID from route parameters
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState(null);
    const [userPosts, setUserPosts] = useState([]); // State for storing user posts
    const [isFollowed, setIsFollowed] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const authToken = Cookies.get('authToken');
    const [show, setShow] = useState(false);
    const [followers, setFollowers] = useState(0);
    const [following, setFollowing] = useState(0);
    const [totalPosts, setPosts] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        gender: '',
        bio: ''
    });
    const [isUsernameValid, setIsUsernameValid] = useState(true);
    const [usernameError, setUsernameError] = useState('');

    useEffect(() => {
        if (!userid) return; // If no user ID, return early

        // Make the API call to fetch user data with the token in the header
        axios.get(`${backend_url}/api/user/${userid}`, {
            headers: {
                'token': authToken
            }
        })
            .then(response => {
                setUserInfo(response.data.user);
                setFollowers(response.data.followersCount);
                setFollowing(response.data.followingCount);
                setIsFollowed(response.data.followed);
                setFormData({
                    name: response.data.user.name || '',
                    username: response.data.user.username || '',
                    gender: response.data.user.gender || '',
                    bio: response.data.user.bio || ''
                });
            })
            .catch(error => {
                console.error("There was an error fetching the user data!", error);
            });

        // Initial fetch of user posts
        fetchUserPosts(1);
    }, [userid, authToken, backend_url]);

    const fetchUserPosts = async (page) => {
        try {
            const response = await axios.get(`${backend_url}/api/post/user/${userid}?page=${page}&limit=2`, {
                headers: {
                    'token': authToken
                }
            });
            const newPosts = response.data.posts;
            setPosts(response.data.totalPosts)

            setUserPosts(prevPosts => {
                const postIds = new Set(prevPosts.map(post => post._id));
                const filteredPosts = newPosts.filter(post => !postIds.has(post._id));
                return [...prevPosts, ...filteredPosts];
            });

            setHasMore(newPosts.length > 0); // If there are no more posts, set hasMore to false
        } catch (error) {
            console.error("There was an error fetching the user posts!", error);
        }
    };

    const fetchMoreData = () => {
        setPage(prevPage => {
            const newPage = prevPage + 1;
            fetchUserPosts(newPage);
            return newPage;
        });
    };

    const handleToggleLike = async (postId, liked) => {
        if (!authToken) {
            navigate('/SignupLogin');
            return;
        }

        try {
            await axios.post(
                `${backend_url}/api/like/post/${postId}/like`,
                {},
                {
                    headers: {
                        'token': authToken
                    }
                }
            );

            setUserPosts(prevPosts => prevPosts.map(post =>
                post._id === postId ? { ...post, likesCount: liked ? post.likesCount - 1 : post.likesCount + 1, liked: !liked } : post
            ));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleFollowUnfollow = async () => {
        if (!authToken) {
            navigate('/SignupLogin'); // Redirect to the login page if not authenticated
            return;
        }

        try {
            const response = await axios.post(`${backend_url}/api/follow/${userInfo._id}/follow`, {}, {
                headers: {
                    'token': authToken
                }
            });

            if (response.status === 200) {
                setIsFollowed(!isFollowed);
            } else {
                console.error('Error following/unfollowing profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error following/unfollowing profile:', error);
        }
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!authToken) {
            navigate('/SignupLogin');
            return;
        }

        try {
            const response = await axios.put(
                `${backend_url}/api/user`,
                formData,
                {
                    headers: {
                        token: authToken,
                    },
                }
            );

            if (response.data.success) {
                setUserInfo(response.data.user);
                setShow(false);
                navigate(`/profile/${userData._id}`);
            } else {
                console.error('Error updating profile:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    const handleShare = (post) => {
        if (navigator.share) {
            navigator.share({
                title: 'Check out this post!',
                text: post.title,
                url: `${window.location.origin}/post/${post._id}`
            }).then(() => {
                console.log('Thanks for sharing!');
            }).catch((error) => {
                console.error('Error sharing:', error);
            });
        } else {
            alert('Sharing is not supported on this browser.');
        }
    };

    const handleDeletePost = async (postId) => {
        if (!authToken) {
            navigate('/SignupLogin');
            return;
        }

        try {
            const response = await axios.delete(`${backend_url}/api/post/${postId}`, {
                headers: {
                    'token': authToken
                }
            });

            if (response.status === 200) {
                setUserPosts(prevPosts => prevPosts.filter(post => post._id !== postId));
                setPosts(totalPosts - 1);
            } else {
                console.error('Error deleting post:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    if (!userInfo) {
        return <div><center><img src={loader} alt=""width={39} /></center></div>;
    }

    const checkUsernameAvailability = async (username) => {
        const usernameRegex = /^[a-zA-Z0-9_]+$/;
        if (userInfo.username === username) {
            return
        }
        if (!usernameRegex.test(username)) {
            setIsUsernameValid(false);
            setUsernameError('No spaces and special characters allowed');
            return;
        }

        try {
            const response = await axios.post(`${backend_url}/api/auth/check-username`, { username });
            setIsUsernameValid(response.data.success);
            setUsernameError(response.data.message);
        } catch (error) {
            console.error('Username Check Error:', error);
            setIsUsernameValid(false);
            setUsernameError('This username is already taken');
        }
    };

    const handleChange = (e) => {
        
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'username') {
            checkUsernameAvailability(value);
        }
    };
    return (
        <div className="profile-container">
            <div className="profile">
                <div className="dp">
                    <img src={userdp} width={160} alt="Profile" /> {/* Use the user profile picture */}
                </div>
                <div className="info">
                    <p>@{userInfo.username}</p>
                    <p>{userInfo.name}</p>
                    <p><pre>{userInfo.bio}</pre></p>
                    {userData._id === userInfo._id ?
                        <button className="follow-button followed" onClick={handleShow}>
                            Edit Profile
                        </button> :
                        <button className={isFollowed ? "follow-button followed" : "follow-button"} onClick={handleFollowUnfollow}>
                            {isFollowed ? 'Unfollow' : 'Follow'}
                        </button>
                    }

                    <>
                        <Modal
                            show={show}
                            onHide={handleClose}
                            centered
                            aria-labelledby="exampleModalCenterTitle"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="exampleModalCenterTitle">Edit Profile</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter name" />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="username">Username</label>
                                        <input type="text" className="form-control" id="username" name="username" value={formData.username} onChange={handleChange} placeholder="Enter username" />
                                        {usernameError}
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bio">Bio</label>
                                        <textarea className="form-control" id="bio" name="bio" value={formData.bio} onChange={handleChange} rows="3"></textarea>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender">Gender</label>
                                        <select className="form-control" id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                            <option value="">Select</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn btn-primary">Update</button>
                                </form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </>

                    <br />
                    <br />
                    <hr />
                    <div className="stats">
                        <div className="stat">
                            <span className="stat-number">{totalPosts}</span> {/* Number of posts */}
                            <span className="stat-label">Posts</span>
                        </div>
                            <Link to="followers" style={{textDecoration:'none',color:"black"}}>
                        <div className="stat">
                            <span className="stat-number">{followers}</span>
                            <span className="stat-label">Followers</span>
                        </div>
                            </Link>

                            <Link to={following===0?"":`following`} style={{textDecoration:'none',color:"black"}}>
                        <div className="stat">
                            <span className="stat-number">{following}</span>
                            <span className="stat-label">Following</span>
                        </div>
                            </Link>
                    </div>
                </div>
            </div>
            <hr className="profile-hr" />
            <div className="post-section">
                <InfiniteScroll
                    dataLength={userPosts.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>
                        <center>
                            <img src={loader} alt=""width={39} />
                            </center>
                            </h4>}
                    endMessage={<p style={{ textAlign: 'center' }}>No more posts</p>}
                >
                    {userPosts.length === 0 ? (
                        <center>
                            <h1>No posts</h1>
                        </center>
                    ) : (
                        userPosts.map(post => (
                            <div key={post._id} className="postcard">
                                <Link to={`/post/${post._id}`}>
                                    <div>
                                        {post.content.length > 100 ? (
                                            <>
                                                <div dangerouslySetInnerHTML={{ __html: post.content.slice(0, 100) + '...' }} />
                                                <Link to={`/post/${post._id}`}>Read more</Link>
                                            </>
                                        ) : (
                                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                                        )}
                                    </div>
                                </Link>
                                <div className="tags">
                                    <span style={{ fontSize: '1rem' }}>
                                        <i
                                            className={`fa-${post.liked ? 'solid' : 'regular'} fa-heart`}
                                            onClick={() => handleToggleLike(post._id, post.liked)}
                                            style={{ cursor: 'pointer' }}
                                        ></i> {post.likesCount}
                                        &nbsp;&nbsp;&nbsp;
                                        <i
                                            className="fa-solid fa-share"
                                            onClick={() => handleShare(post)}
                                            style={{ cursor: 'pointer' }}
                                        ></i>&nbsp;{post.shares}
                                        &nbsp;&nbsp;&nbsp;
                                        {userData._id === post.userId._id && (
                                            <i
                                                className="fa-solid fa-trash"
                                                onClick={() => handleDeletePost(post._id)}
                                                style={{ cursor: 'pointer' }}
                                            ></i>
                                        )}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </InfiniteScroll>
            </div>
        </div>
    );
}
