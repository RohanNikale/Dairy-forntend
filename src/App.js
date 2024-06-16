import React from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
// Import other components as needed
// import TinyMCE from './components/TinyMCE';
import PostForm from './components/PostForm';
import PostView from './pages/PostView';
import {  Routes, Route, useLocation } from 'react-router-dom';
import Following from './pages/Following';
import WhoToFollow from './components/WhoToFollow';
import SignupLogin from './pages/SignupLogin';
import PostList from './pages/PostList';
import Profile from './pages/Profile';
import FollowAndFollowing from './pages/FollowAndFollowing';
import Notification from './pages/Notification';
import Test from './components/test';
import UserToFollow from './pages/UserToFollow';
function App() {

  return (
      <div className="app">
        <ConditionalNavbar />
        <div className="d-flex flex-row justify-content-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/following" element={<Following />} />
            <Route path="/gazal" element={<PostList key={"gazal"} type={"gazal"} />} />
            <Route path="/nazm" element={<PostList key={"nazm"} type={"nazm"} />} />
            <Route path="/geet" element={<PostList key={"geet"} type="geet" />} />
            <Route path="/post-form" element={<PostForm />} />
            <Route path="/post/:postid" element={<PostView />} />
            <Route path="/SignupLogin" element={<SignupLogin />} />
            <Route path="/profile/:userid" element={<Profile />} />
            <Route path="/profile/:userid/:followAndfollowings" element={<FollowAndFollowing />} />
            <Route path="/notification" element={<Notification />} />
            <Route path="/test" element={<Test />} />
            <Route path="/whotofollow" element={<UserToFollow />} />
            {/* Add more routes for other pages */}
          </Routes>
          
          <ConditionalWhoToFollow />
        </div>
        <br />
        <br />
        <br />
        <br />
        <br />  
        <ConditionalBottomNav />
      </div>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  return location.pathname === '/SignupLogin'||location.pathname=== '/whotofollow' ? null : <Navbar />;
}
function ConditionalBottomNav() {
  const location = useLocation();
  return location.pathname === '/SignupLogin'||location.pathname=== '/whotofollow' ? null : <BottomNav />;
}

function ConditionalWhoToFollow() {
  const location = useLocation();
  console.log()
  return (location.pathname === '/SignupLogin'|| location.pathname=== '/post-form' ||location.pathname=== '/whotofollow' || location.pathname.startsWith('/profile')) ?  null:<WhoToFollow /> ;
}

export default App;