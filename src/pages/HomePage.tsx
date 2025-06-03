import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAllPosts } from '../api/posts';
import type { Post } from '../types/post';
import { formatDistance } from 'date-fns';
import { ja } from 'date-fns/locale';

const HomePage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const postsData = await getAllPosts();
        setPosts(postsData);
      } catch (err) {
        console.error('投稿の取得に失敗しました: ', err);
        setError('投稿の取得に失敗しました。後でもう一度お試しください。');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchPosts();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="home-container not-authenticated">
        <h2>ログインが必要です</h2>
        <p>投稿を見るにはログインしてください</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="home-container loading">
        <p>読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container error">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="page-title">ホーム</h1>

      <div className="posts-container">
        {posts.length === 0 ? (
          <p className="no-posts">投稿がありません。</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="post-user">
                  {post.user ? (
                    <span className="user-name">{post.user.name}</span>
                  ) : (
                    <span className="user-name">不明なユーザー</span>
                  )}
                </div>
                <div className="post-time">
                  {formatDistance(new Date(post.created_at), new Date(), {
                    addSuffix: true,
                    locale: ja
                  })}
                </div>
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-actions">
                {/* いいねボタンなど */}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;