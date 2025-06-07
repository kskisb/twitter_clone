import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import PostDetailPage from './pages/PostDetailPage';
import UserPage from './pages/UserPage';
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
                  <UserPage />
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