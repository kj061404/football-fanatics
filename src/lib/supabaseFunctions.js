import supabase from './supabaseClient';


export const getPosts = async () => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
    return { data, error };
}


export const getPostById = async (id) => {
    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching post:', error);
        return [];
    }
    return { data, error };
}

export const getComments = async (postId) => {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId);

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
    return { data, error };
}

export const createPost = async (postData) => {
    const { data, error } = await supabase
        .from('posts')
        .insert({
            title: postData.title,
            content: postData.content,
            user_id: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
            tags: postData.tags,
            image_url: postData.image_url
        })
        .select();

    if (error) {
        console.error('Error creating post:', error);
        return null;
    }
    return data;
}


export const createComment = async (commentData) => {
    const { data, error } = await supabase
        .from('comments')
        .insert({
            content: commentData.content,
            user_id: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
            post_id: commentData.postId
        })
        .select();

    if (error) {
        console.error('Error creating comment:', error);
        return null;
    }
    return data;
}


export const uploadImage = async (file) => {
    if (!file) return null;
  
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error: uploadError } = await supabase
      .storage
      .from('post-images') // your Supabase bucket name
      .upload(fileName, file);
  
    if (uploadError) {
      console.error('Image upload failed:', uploadError);
      return null;
    }
  
    const { data: urlData } = supabase
      .storage
      .from('post-images')
      .getPublicUrl(fileName);
  
    return urlData.publicUrl;
  };