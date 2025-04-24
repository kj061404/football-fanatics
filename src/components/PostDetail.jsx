import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getComments, getPostById } from '../lib/supabaseFunctions';

function PostDetail() {
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await getComments(id);
      if (error) {
        console.error('Error fetching comments:', error);
      } else {
        console.log("Fetched comments:", data);
        setComments(data);
      }
    };

    const fetchPostById = async () => {
      const { data, error } = await getPostById(id);
      if (error) {
        console.error('Error fetching post:', error);
      } else {
        console.log("Fetched post:", data);
        setPost(data);
      }
    };

    fetchPostById();
    fetchComments();
  }, [id]);



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