import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComments, getPostById, createComment } from '../lib/supabaseFunctions';
import supabase from '../lib/supabaseClient';
import styles from './PostDetail.module.css';

function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upvotes, setUpvotes] = useState(0);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post
        const { data: postData, error: postError } = await getPostById(id);
        if (postError) throw postError;
        setPost(postData);
        setUpvotes(postData.upvotes || 0);
        setEditedTitle(postData.title);
        setEditedContent(postData.content);

        // Check if current user is the author
        const currentUserId = localStorage.getItem('userId');
        setIsCurrentUser(currentUserId === postData.user_id);

        // Fetch comments
        const { data: commentsData, error: commentsError } = await getComments(id);
        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('posts')
        .update({
          title: editedTitle,
          content: editedContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      setPost(prev => ({
        ...prev,
        title: editedTitle,
        content: editedContent,
        updated_at: new Date().toISOString()
      }));
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      navigate('/');
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleUpvote = async () => {
    if (isUpvoting) return;
    
    try {
      setIsUpvoting(true);
      const newUpvoteCount = upvotes + 1;
      
      // Update the database
      const { error } = await supabase
        .from('posts')
        .update({ upvotes: newUpvoteCount })
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setUpvotes(newUpvoteCount);
      setPost(prev => ({ ...prev, upvotes: newUpvoteCount }));
      setHasUpvoted(true);
    } catch (err) {
      console.error('Error updating upvotes:', err);
      setError('Failed to update upvotes. Please try again.');
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmittingComment) return;

    try {
      setIsSubmittingComment(true);
      const commentData = {
        content: newComment.trim(),
        postId: id
      };

      const data = await createComment(commentData);
      
      if (data) {
        // Add the new comment to the list
        setComments(prev => [...prev, data[0]]);
        // Clear the input
        setNewComment('');
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleCommentEdit = async (commentId) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({
          content: editedCommentContent,
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, content: editedCommentContent, updated_at: new Date().toISOString() }
          : comment
      ));
      setEditingCommentId(null);
      setEditedCommentContent('');
    } catch (err) {
      console.error('Error updating comment:', err);
      setError('Failed to update comment. Please try again.');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError('Failed to delete comment. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className={styles['post-detail-container']}>
      <div className={styles['post-detail']}>
        {isCurrentUser && !isEditing && (
          <div className={styles['post-actions-admin']}>
            <button 
              onClick={() => setIsEditing(true)}
              className={`${styles.btn} ${styles['edit-btn']}`}
            >
              Edit Post
            </button>
            <button 
              onClick={handleDelete}
              className={`${styles.btn} ${styles['delete-btn']}`}
            >
              Delete Post
            </button>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleEdit} className={styles['edit-form']}>
            <div className={styles['form-group']}>
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                required
                className={styles['edit-input']}
              />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                required
                rows={5}
                className={styles['edit-input']}
              />
            </div>
            <div className={styles['form-actions']}>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className={`${styles.btn} ${styles['cancel-btn']}`}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className={`${styles.btn} ${styles['save-btn']}`}
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className={styles['post-header']}>
              <div className={styles['user-info']}>
                <div className={styles['user-avatar']}></div>
                <div className={styles['user-meta']}>
                  <span className={styles.username}>{post.username}</span>
                  <span className={styles.timestamp}>
                    {post.updated_at ? 
                      `Updated ${new Date(post.updated_at).toLocaleString()}` :
                      new Date(post.created_at).toLocaleString()
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <h1 className={styles['post-title']}>{post.title}</h1>
            {post.image_url && (
              <div className={styles['post-image']}>
                <img src={post.image_url} alt={post.title} />
              </div>
            )}
            <p className={styles['post-content']}>{post.content}</p>
            
            <div className={styles['post-actions']}>
              <button 
                className={`${styles['action-btn']} ${styles['like-btn']} ${hasUpvoted ? styles.upvoted : ''}`}
                onClick={handleUpvote}
                disabled={isUpvoting}
              >
                <span className={styles.icon}>⬆️</span>
                <span className={styles.count}>{upvotes}</span>
              </button>
              <button className={`${styles['action-btn']} ${styles['comment-btn']}`}>
                <span className={styles.icon}>💬</span>
                <span className={styles.count}>{comments.length}</span>
              </button>
            </div>
          </>
        )}
      </div>
      
      <div className={styles['comments-section']}>
        <h3>Comments ({comments.length})</h3>
        
        <form onSubmit={handleCommentSubmit} className={styles['comment-form']}>
          <textarea
            className={styles['comment-input']}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={3}
            required
          />
          <button 
            type="submit" 
            className={styles['submit-btn']}
            disabled={isSubmittingComment || !newComment.trim()}
          >
            {isSubmittingComment ? 'Posting...' : 'Post Comment'}
          </button>
        </form>

        <div className={styles['comments-list']}>
          {comments.map(comment => {
            const isCommentAuthor = comment.user_id === localStorage.getItem('userId');
            const isEditingThisComment = editingCommentId === comment.id;

            return (
              <div key={comment.id} className={styles['comment-item']}>
                <div className={styles['comment-header']}>
                  <div className={styles['user-info']}>
                    <div className={`${styles['user-avatar']} ${styles.small}`}></div>
                    <span className={styles.username}>{comment.username}</span>
                  </div>
                  <div className={styles['comment-meta']}>
                    <span className={styles.timestamp}>
                      {comment.updated_at ? 
                        `Updated ${new Date(comment.updated_at).toLocaleString()}` :
                        new Date(comment.created_at).toLocaleString()
                      }
                    </span>
                    {isCommentAuthor && !isEditingThisComment && (
                      <div className={styles['comment-actions']}>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditedCommentContent(comment.content);
                          }}
                          className={`${styles.btn} ${styles['edit-btn']} ${styles.small}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleCommentDelete(comment.id)}
                          className={`${styles.btn} ${styles['delete-btn']} ${styles.small}`}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                {isEditingThisComment ? (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleCommentEdit(comment.id);
                    }}
                    className={styles['edit-comment-form']}
                  >
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      className={styles['edit-comment-input']}
                      rows={3}
                      required
                    />
                    <div className={styles['edit-comment-actions']}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditedCommentContent('');
                        }}
                        className={`${styles.btn} ${styles['cancel-btn']} ${styles.small}`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className={`${styles.btn} ${styles['save-btn']} ${styles.small}`}
                      >
                        Save
                      </button>
                    </div>
                  </form>
                ) : (
                  <p className={styles['comment-content']}>{comment.content}</p>
                )}
              </div>
            );
          })}
          {comments.length === 0 && (
            <p className={styles['no-comments']}>No comments yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostDetail; 