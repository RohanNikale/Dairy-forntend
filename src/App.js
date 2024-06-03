import React from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
// Import other components as needed
// import TinyMCE from './components/TinyMCE';
import PostForm from './components/PostForm';
import PostView from './pages/PostView';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Following from './pages/Following';
import WhoToFollow from './components/WhoToFollow';
import SignupLogin from './pages/SignupLogin';
import PostList from './pages/PostList';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <ConditionalNavbar />
        <div className="d-flex flex-row justify-content-center">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/following" element={<Following />} />
            <Route path="/gazal" element={<PostList type={"gazal"} />} />
            <Route path="/nazm" element={<PostList type={"nazm"} />} />
            <Route path="/geet" element={<PostList type="geet" />} />
            <Route path="/post-form" element={<PostForm />} />
            <Route path="/post/:postid" element={<PostView />} />
            <Route path="/SignupLogin" element={<SignupLogin />} />
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
    </BrowserRouter>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  return location.pathname === '/SignupLogin' ? null : <Navbar />;
}
function ConditionalBottomNav() {
  const location = useLocation();
  return location.pathname === '/SignupLogin' ? null : <BottomNav />;
}

function ConditionalWhoToFollow() {
  const location = useLocation();
  console.log(location.pathname==='/post')
  return (location.pathname === '/SignupLogin'|| location.pathname=== '/post-form') ?  null:<WhoToFollow /> ;
}

export default App;