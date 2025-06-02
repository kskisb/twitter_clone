import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import SignupPage from './pages/SignupPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          {/* 今後他のページを追加していく */}
          <Route path="/" element={<div>ホームページ（準備中）</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;