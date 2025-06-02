import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { signup } from '../api/auth';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // APIを呼び出してユーザー登録
      const response = await signup({ name, email, password });

      // 認証情報をコンテキストに保存
      login(response.user, response.token);

      // ホーム画面に遷移
      navigate('/');
    } catch (err: any) {
      console.error('サインアップエラー:', err);
      setError(
        err.response?.data?.errors?.join(', ') ||
        'サインアップできませんでした。もう一度お試しください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h1>アカウント作成</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">名前</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="signup-button"
        >
          {isLoading ? '処理中...' : 'アカウント作成'}
        </button>
      </form>

      <div className="login-link">
        <p>すでにアカウントをお持ちですか？ <a href="/login">ログイン</a></p>
      </div>
    </div>
  );
};

export default SignupPage;