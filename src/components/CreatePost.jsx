import { useState } from 'react';
import './CreatePost.css';
import { createPost, uploadImage } from '../lib/supabaseFunctions';

function CreatePost() {
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        tags: ''
    });

    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            // Create a temporary URL for preview
            const tempUrl = URL.createObjectURL(file);
            setPostData(prev => ({ ...prev, imageUrl: tempUrl }));
        }
    };

    const validateForm = () => {
        if (!postData.title.trim()) {
            setError('Title is required');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            setIsSubmitting(true);
            
            let imageUrl = '';
            // Upload image if one was selected
            if (imageFile) {
                const uploadedImageUrl = await uploadImage(imageFile);
                if (!uploadedImageUrl) {
                    throw new Error('Failed to upload image');
                }
                imageUrl = uploadedImageUrl;
            }

            // Create the post with Supabase
            const postDataToSubmit = {
                title: postData.title,
                content: postData.content,
                image_url: imageUrl,
                tags: postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
            };

            const newPost = await createPost(postDataToSubmit);
            
            if (!newPost) {
                throw new Error('Failed to create post');
            }

            // Clear form after successful submission
            setPostData({
                title: '',
                content: '',
                imageUrl: '',
                tags: ''
            });
            setImageFile(null);
            
            alert('Post created successfully!');
            
        } catch (err) {
            setError(err.message || 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="create-post-container">
            <h2>Create a New Post</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={postData.title}
                        onChange={handleChange}
                        placeholder="What's on your mind?"
                        required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <textarea
                        id="content"
                        name="content"
                        value={postData.content}
                        onChange={handleChange}
                        placeholder="Share your thoughts, analysis, or questions..."
                        rows="6"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    {postData.imageUrl && (
                        <div className="image-preview">
                            <img 
                                src={postData.imageUrl} 
                                alt="Preview" 
                                style={{ maxWidth: '200px', marginTop: '10px' }}
                            />
                        </div>
                    )}
                </div>
                
                <div className="form-group">
                    <label htmlFor="tags">Tags (comma separated)</label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={postData.tags}
                        onChange={handleChange}
                        placeholder="NFL, Fantasy, College, etc."
                    />
                </div>
                
                <div className="form-actions">
                    <button 
                        type="button" 
                        className="btn cancel-btn"
                        onClick={() => {
                            setPostData({
                                title: '',
                                content: '',
                                imageUrl: '',
                                tags: ''
                            });
                            setImageFile(null);
                            setError('');
                        }}
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="btn submit-btn"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create Post'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;