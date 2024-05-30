import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
// Import other components as needed
// import TinyMCE from './components/TinyMCE';
import PostForm from './components/PostForm';
import PostView from './pages/PostView';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Following from './pages/Following';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/following" element={<Following />} />
          <Route path="/post-form" element={<PostForm />} />
          <Route path="/post/:postid" element={<PostView />} />
          {/* Add more routes for other pages */}
        </Routes>
        {/* <BottomNav /> */}
      </BrowserRouter>
    </div>
  );
}

export default App;
