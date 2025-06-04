import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts } from '../api/posts';
import type { Post } from '../types/post';
import CreatePostForm from '../components/CreatePostForm';
import CreatePostButton from '../components/CreatePostButton';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const postsData = await getAllPosts();
      setPosts(postsData);
    } catch (err) {
      console.error('投稿の取得に失敗しました:', err);
      setError('投稿の取得に失敗しました。後でもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p))
  }

  const handlePostDeleted = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  if (!isAuthenticated) {
    return (
      <div className="home-container not-authenticated">
        <h2>ログインが必要です</h2>
        <p>投稿を見るにはログインしてください。</p>
      </div>
    );
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="home-container loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error && posts.length === 0) {
    return (
      <div className="home-container error">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="page-title">ホーム</h1>

      <div className="home-post-form-container">
        <CreatePostForm onPostCreated={handlePostCreated} />
      </div>

      <div className="posts-container">
        {posts.length === 0 ? (
          <p className="no-posts">投稿がありません。</p>
        ) : (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdated={handlePostUpdated}
              onPostDeleted={handlePostDeleted}
            />
          ))
        )}
      </div>

      <CreatePostButton onPostCreated={handlePostCreated} />
    </div>
  );
};

export default HomePage;