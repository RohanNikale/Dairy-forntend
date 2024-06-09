import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './WhoToFollow.css';
import { Link, useNavigate } from 'react-router-dom';
import { MyContext } from '../MyContext';
import { Button, Modal } from 'react-bootstrap';

function FollowAndFollowing({ userId, followAndfollowings }) {
    const { backend_url } = useContext(MyContext);
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const token = Cookies.get('authToken');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const fetchProfiles = useCallback(async (page) => {
        if (!token) {
            navigate('/SignupLogin');
            return;
        }

        try {
            const response = await axios.get(`${backend_url}/api/follow/${userId}/${followAndfollowings}`, {
                headers: {
                    'token': token
                },
                params: {
                    page: page,
                    limit: 4
                }
            });

            if (page === 1) {
                setProfiles(response.data.profiles);
            } else {
                setProfiles(prevProfiles => [...prevProfiles, ...response.data.profiles]);
            }
            setCurrentPage(response.data.currentPage);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    }, [backend_url, token, userId, followAndfollowings, navigate]);

    useEffect(() => {
        fetchProfiles(1); // Fetch initial profiles when component mounts
    }, [fetchProfiles]);

    const handleFollowUnfollow = async (profileId, isFollowed) => {
        if (!token) {
            navigate('/SignupLogin');
            return;
        }

        try {
            const response = await axios.post(`${backend_url}/api/follow/${profileId}/follow`, {}, {
                headers: {
                    'token': token
                }
            });

            if (response.status === 200) {
                setProfiles(profiles.map(profile =>
                    profile.id === profileId ? { ...profile, followed: !isFollowed } : profile
                ));
            } else {
                console.error('Error following/unfollowing profile:', response.statusText);
            }
        } catch (error) {
            console.error('Error following/unfollowing profile:', error);
        }
    };

    const handleShowMore = () => {
        if (currentPage < totalPages) {
            fetchProfiles(currentPage + 1);
        }
    };

    return (
        <div>
            {/* Button trigger modal */}
            <Button variant="primary" onClick={handleShow}>
                Launch demo modal
            </Button>

            {/* Modal */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Followers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span className="divider"></span>
                    {profiles.map(profile => (
                        <div key={profile.id} className="profile">
                            <div className="profile-pic" style={{ backgroundColor: profile.picColor || 'gray' }}></div>
                            <div className="profile-info">
                                <Link style={{ color: "black", textDecoration: "none" }} to={`/profile/${profile.id}`}>
                                    <span className="display-name">{profile.displayName}</span>
                                </Link>
                                <span className="username">{profile.username}</span>
                            </div>
                            <button
                                className={`follow-button ${profile.followed ? 'followed' : ''}`}
                                onClick={() => handleFollowUnfollow(profile.id, profile.followed)}
                            >
                                {profile.followed ? 'Unfollow' : 'Follow'}
                            </button>
                            <span className="divider"></span>
                        </div>
                    ))}
                    {currentPage < totalPages && (
                        <button onClick={handleShowMore} className="show-more">Show more</button>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default FollowAndFollowing;
