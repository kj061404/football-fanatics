import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { getPosts } from '../lib/supabaseFunctions';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt'); // 'createdAt' or 'upvotes'
  const [searchQuery, setSearchQuery] = useState('');
  const [displayedPosts, setDisplayedPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await getPosts();
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        console.log("Fetched posts:", data);
        setPosts(data);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    // Filter and sort posts whenever posts, sortBy, or searchQuery changes
    let filtered = [...posts];
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
    });

    setDisplayedPosts(filtered);
  }, [posts, sortBy, searchQuery]);

  return (
    <div className="home-container">
      <div className="feed-container">
        <h2 className="feed-title">Latest Posts</h2>
        
        <div className="feed-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search posts by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="sort-container">
            <label htmlFor="sort-select">Sort by: </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="createdAt">Latest</option>
              <option value="upvotes">Most Upvoted</option>
            </select>
          </div>
        </div>

        <div className="posts-grid">
          {displayedPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage; 