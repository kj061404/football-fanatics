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
        <span className="timestamp">{post.created_at ? new Date(post.created_at).toLocaleString() : 'No timestamp available'}</span>
      </div>
        <h3 className="post-title">{post.title}</h3>
      <div className="post-footer">
        <div className="post-actions">
          <button className="action-btn upvote-btn">
            <span className="icon">⬆️</span>
            <span className="count">{post.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
    </Link>
  );
}

export default PostCard; 