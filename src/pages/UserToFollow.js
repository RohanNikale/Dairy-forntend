import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import './UserToFollow.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MyContext } from '../MyContext';
import userpic from '../components/user.png';
import loader from '../components/loader.gif';

export default function FollowAndFollowing() {
    const { userid, followAndfollowings } = useParams();
    const { backend_url } = useContext(MyContext);
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const token = Cookies.get('authToken');

    const fetchProfiles = useCallback(async (page) => {
        if (!token) {
            navigate('/SignupLogin');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.get(`${backend_url}/api/follow/profiles-to-follow`, {
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
        } finally {
            setIsLoading(false);
        }
    }, [backend_url, token, navigate]);

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
            <div id="mybutton">
                <Link to="/">
                    <button className="feedback"><i class="fa-solid fa-arrow-right"></i></button>
                </Link>
            </div>
            <h1 className="card-title">Pepole to follow</h1>
            {isLoading && <div className="loader"><center>
                <img src={loader} alt="" width={39} />
            </center>
            </div>}
            {!isLoading && profiles.length === 0 && `No ${followAndfollowings}`}
            <span className="divider"></span>
            {profiles.map(profile => (
                <div key={profile.id} className="profile">
                    <img src={userpic} alt="user" width={39} /> &nbsp;&nbsp;
                    <div className="profile-info">
                        <Link style={{ color: "black", textDecoration: "none" }} to={`/profile/${profile._id}/`}>
                            <span className="display-name">{profile.displayName}</span>
                            <span className="username">{profile.username}</span>
                        </Link>
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
            {currentPage < totalPages && !isLoading && (
                <button onClick={handleShowMore} className="show-more">Show more</button>
            )}
        </div>
    );
}
