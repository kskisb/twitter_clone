import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import PostDetailPage from './pages/PostDetailPage';
import UserPostsPage from './pages/UserPostsPage';
import UserLikesPage from './pages/UserLikesPage';
import UserFollowingPage from './pages/UserFollowingPage';
import UserFollowersPage from './pages/UserFollowersPage';
import ConversationsPage from './pages/ConversationsPage';
import ConversationDetailPage from './pages/ConversationDetailPage';

// スタイル
import './App.css';
import './styles/Navbar.css';
import './styles/UserProfile.css';
import './styles/UserFollow.css';
import './styles/PostCard.css';
import './styles/MessageButton.css';
import './styles/Conversations.css';
import './styles/ConversationDetail.css';
import './styles/HomePage.css'; // 新規追加
import './styles/Auth.css'; // 新規追加
import './styles/Modal.css'; // 新規追加

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="app-container">
          <div className="left-sidebar">
            {/* 将来的に実装 */}
          </div>

          <div className="main-content">
            <Routes>
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/post/:postId"
                element={
                  <ProtectedRoute>
                    <PostDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/:userId"
                element={
                  <ProtectedRoute>
                    <UserPostsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/:userId/likes"
                element={
                  <ProtectedRoute>
                    <UserLikesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/:userId/following"
                element={
                  <ProtectedRoute>
                    <UserFollowingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user/:userId/followers"
                element={
                  <ProtectedRoute>
                    <UserFollowersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <ConversationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/messages/:conversationId"
                element={
                  <ProtectedRoute>
                    <ConversationDetailPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate replace to="/home" />} />
            </Routes>
          </div>

          <div className="right-sidebar">
            {/* 将来的に実装 */}
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;