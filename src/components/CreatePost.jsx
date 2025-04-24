import { useState } from 'react';

function CreatePost() {
    const [postData, setPostData] = useState({
        title: '',
        content: '',
        tags: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPostData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // This would normally submit the post to the backend
        console.log('Post data:', postData);
    };

    return (
        <div className="create-post-container">
            <h2>Create a New Post</h2>
            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title</label>
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
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="image">Image</label>
                    <input
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                        placeholder="Upload an image"
                    />
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
                    <button type="button" className="btn cancel-btn">Cancel</button>
                    <button type="submit" className="btn submit-btn">Post</button>
                </div>
            </form>
        </div>
    );
}

export default CreatePost;