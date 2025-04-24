import { Link } from 'react-router-dom';

function PostCard({ post }) {
  return (
    <Link to={`/post/${post.id}`} className="post-link">
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <div className="user-avatar"></div>
          <span className="username">{post.username}</span>
        </div>
        <span className="timestamp">{post.timestamp}</span>
      </div>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-content">{post.content}</p>
      <div className="post-footer">
        <div className="post-actions">
          <button className="action-btn upvote-btn">
            <span className="icon">⬆️</span>
            <span className="count">{post.likes}</span>
          </button>
          <button className="action-btn comment-btn">
            <span className="icon">💬</span>
            <span className="count">{post.comments}</span>
          </button>
          <button className="action-btn share-btn">
            <span className="icon">🔄</span>
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default PostCard; 