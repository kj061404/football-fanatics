import { useState } from 'react';
import PostCard from './PostCard';

function HomePage() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      username: 'FootballFan1',
      title: 'NFL Season Predictions',
      content: 'Who do you think will make it to the Super Bowl this year?',
      likes: 42,
      comments: 18,
      timestamp: '2h ago'
    },
    {
      id: 2,
      username: 'QBLover22',
      title: 'Best Quarterbacks of All Time',
      content: 'My top 5 QBs in NFL history. What do you think?',
      likes: 89,
      comments: 32,
      timestamp: '4h ago'
    },
    {
      id: 3,
      username: 'DefenseWins',
      title: 'Defensive Strategies',
      content: 'Analysis of the top defensive formations in college football',
      likes: 27,
      comments: 12,
      timestamp: '8h ago'
    }
  ]);

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