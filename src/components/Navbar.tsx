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
      <div className="navbar-brand">
        <Link to="/" className="brand-logo">Twitter</Link>
      </div>
      <div className="navbar-menu">
        {isAuthenticated ? (
          <>
            <div className="welcome-message">
              こんにちは、
              <span className="current-user-name" onClick={handleUserClick}>
                {user?.name}
              </span>
              さん
            </div>
            <button onClick={handleLogout} className="logout-button">
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">ログイン</Link>
            <Link to="/signup" className="nav-link signup">新規登録</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;