import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleUserClick = () => {
    if (user?.id) {
      navigate(`/user/${user.id}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link to="/" className="brand-logo">Twitter Clone</Link>
        </div>
        <div className="navbar-menu">
          {isAuthenticated ? (
            <>
              <Link to="/network" className="nav-icon-link" title="ネットワーク">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <Link to="/messages" className="nav-icon-link" title="メッセージ">
                <svg viewBox="0 0 24 24" width="24" height="24">
                  <path
                    d="M19.25 3.018H4.75C3.233 3.018 2 4.252 2 5.77v12.495c0 1.518 1.233 2.753 2.75 2.753h14.5c1.517 0 2.75-1.235 2.75-2.753V5.77c0-1.518-1.233-2.752-2.75-2.752zm-14.5 1.5h14.5c.69 0 1.25.56 1.25 1.25v.714l-8.05 5.367c-.273.18-.626.182-.9-.002L3.5 6.482v-.714c0-.69.56-1.25 1.25-1.25zm14.5 14.998H4.75c-.69 0-1.25-.56-1.25-1.25V8.24l7.24 4.83c.383.256.822.384 1.26.384.44 0 .877-.128 1.26-.383l7.24-4.83v10.022c0 .69-.56 1.25-1.25 1.25z" 
                    fill="currentColor"
                  />
                </svg>
              </Link>
              <div className="welcome-message">
                <span className="greeting-text">こんにちは、</span>
                <span className="current-user-name" onClick={handleUserClick}>
                  {user?.name}
                </span>
                <span className="greeting-text">さん</span>
              </div>
              <div className="user-avatar" onClick={handleUserClick} title={`${user?.name}のプロフィール`}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <button onClick={handleLogout} className="logout-button">
                <span className="logout-text">ログアウト</span>
                <svg className="logout-icon" viewBox="0 0 24 24" width="20" height="20">
                  <path
                    d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">ログイン</Link>
              <Link to="/signup" className="nav-link signup">新規登録</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;