import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { login } from '../api/auth';
import '../styles/Auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login: LoginContext } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await login(email, password);
      LoginContext(response.user, response.token)
      navigate('/home');
    } catch (err: any) {
      console.error('ログインエラー: ', err);
      setError(
        err.response?.data?.error ||
        'ログインできませんでした。メールアドレスとパスワードを確認してください。'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>ログイン</h1>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
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
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="login-button"
        >
          {isLoading ? '処理中...' : 'ログイン'}
        </button>
      </form>

      <div className="signup-link">
        <p>アカウントをお持ちでないですか？ <a href="/signup">会員登録</a></p>
      </div>
    </div>
  );
};

export default LoginPage;