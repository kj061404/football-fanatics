import { useState, useEffect } from 'react';
import PostCard from './PostCard';
import { getPosts } from '../lib/supabaseFunctions';

function HomePage() {
  const [posts, setPosts] = useState([]);

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
  

  return (
    <div className="home-container">
      <div className="feed-container">
        <h2 className="feed-title">Latest Posts</h2>
        <div className="posts-grid">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage; 