import { useState } from 'react';
import { useParams } from 'react-router-dom';

function PostDetail() {
  const { id } = useParams();
  const [post] = useState({
    id: id,
    username: 'FootballFan1',
    title: 'NFL Season Predictions',
    content: 'Who do you think will make it to the Super Bowl this year? I think the Chiefs have a good chance to return, but the AFC competition is tough. In the NFC, I see the Eagles or 49ers making a strong push.',
    likes: 42,
    comments: [
      {
        id: 1,
        username: 'DefenseWins',
        content: 'I think the Bills finally break through this year!',
        likes: 8,
        timestamp: '1h ago'
      },
      {
        id: 2,
        username: 'QBLover22',
        content: 'Don\'t sleep on the Lions this year. They\'re building something special.',
        likes: 12,
        timestamp: '30m ago'
      },
      {
        id: 3,
        username: 'FootballAnalyst',
        content: 'Chiefs vs Eagles rematch would be epic!',
        likes: 5,
        timestamp: '15m ago'
      }
    ],
    timestamp: '2h ago'
  });

  const [newComment, setNewComment] = useState('');

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    // This would normally submit the comment to the backend
    console.log('New comment:', newComment);
    setNewComment('');
  };

  return (
    <div className="post-detail-container">
      <div className="post-detail">
        <div className="post-header">
          <div className="user-info">
            <div className="user-avatar"></div>
            <div className="user-meta">
              <span className="username">{post.username}</span>
              <span className="timestamp">{post.timestamp}</span>
            </div>
          </div>
        </div>
        
        <h1 className="post-title">{post.title}</h1>
        <p className="post-content">{post.content}</p>
        
        <div className="post-actions">
          <button className="action-btn like-btn">
            <span className="icon">⬆️</span>
            <span className="count">{post.likes}</span>
          </button>
          <button className="action-btn comment-btn">
            <span className="icon">💬</span>
            <span className="count">{post.comments.length}</span>
          </button>
        </div>
      </div>
      
      <div className="comments-section">
        <h3>Comments</h3>
        
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea 
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
          <button type="submit" className="btn comment-submit-btn">Comment</button>
        </form>
        
        <div className="comments-list">
          {post.comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="user-info">
                  <div className="user-avatar small"></div>
                  <span className="username">{comment.username}</span>
                </div>
                <span className="timestamp">{comment.timestamp}</span>
              </div>
              <p className="comment-content">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PostDetail; 