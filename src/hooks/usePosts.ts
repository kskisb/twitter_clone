import { useState } from 'react';
import type { Post } from '../types/post';

export const usePosts = (initialPosts: Post[] = []) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const updatePost = (updatedPost: Post) => {
    setPosts(posts.map(post => {
      if (post.id === updatedPost.id) {
        // 元の投稿のユーザー情報を保持
        return {
          ...updatedPost,
          user: post.user,
          user_id: post.user_id
        };
      }
      return post;
    }));
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