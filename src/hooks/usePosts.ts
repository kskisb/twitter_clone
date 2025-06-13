import { useState } from 'react';
import type { Post } from '../types/post';

export const usePosts = (initialPosts: Post[] = []) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
  };

  const deletePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const toggleLike = (postId: number, liked: boolean) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes_count: liked ? post.likes_count + 1 : Math.max(post.likes_count - 1, 0),
          liked_by_current_user: liked
        };
      }
      return post;
    }));
  };

  return { posts, setPosts, updatePost, deletePost, toggleLike };
};