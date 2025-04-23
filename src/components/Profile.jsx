import { useState } from 'react';
import PostCard from './PostCard';

function Profile() {
  const [userProfile] = useState({
    username: 'FootballExpert',
    name: 'John Smith',
    bio: 'Football analyst and fantasy football enthusiast. Super Bowl champion in my dreams.',
    followers: 1284,
    following: 567,
    posts: [
      {
        id: 1,
        username: 'FootballExpert',
        title: 'My Fantasy Draft Strategy',
        content: 'Here are my top picks for this season\'s fantasy draft...',
        likes: 76,
        comments: 24,
        timestamp: '1d ago'
      },
      {
        id: 2,
        username: 'FootballExpert',
        title: 'Defensive Breakdown: Week 3',
        content: 'Analyzing the defensive performances from the weekend...',
        likes: 53,
        comments: 12,
        timestamp: '3d ago'
      }
    ]
  });

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar"></div>
        <div className="profile-info">
          <h2>{userProfile.name}</h2>
          <h3 className="username">@{userProfile.username}</h3>
          <p className="bio">{userProfile.bio}</p>
          <div className="stats">
            <div className="stat-item">
              <span className="stat-value">{userProfile.followers}</span>
              <span className="stat-label">Followers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{userProfile.following}</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
          <button className="btn edit-profile-btn">Edit Profile</button>
        </div>
      </div>
      
      <div className="profile-tabs">
        <button className="tab-btn active">Posts</button>
        <button className="tab-btn">Likes</button>
        <button className="tab-btn">Comments</button>
      </div>
      
      <div className="profile-content">
        <div className="user-posts">
          {userProfile.posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile; 