import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './components/HomePage'
import CreatePost from './components/CreatePost'
import PostDetail from './components/PostDetail'
import NotFound from './components/NotFound'
import { generateUsername } from './lib/generateUsername'
import { useEffect } from 'react'

function App() {

  useEffect(() => {
    if (!localStorage.getItem("userId")) {
      const userId = crypto.randomUUID();
      const username = generateUsername();
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
    }
  }, []);

  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreatePost />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
