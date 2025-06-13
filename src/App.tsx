import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostDetailPage from './pages/PostDetailPage';
import UserPostsPage from './pages/UserPostsPage';
import UserLikesPage from './pages/UserLikesPage';
import UserFollowingPage from './pages/UserFollowingPage'; // 追加
import UserFollowersPage from './pages/UserFollowersPage'; // 追加
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
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
            <Route path="/" element={<Navigate replace to="/home" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;