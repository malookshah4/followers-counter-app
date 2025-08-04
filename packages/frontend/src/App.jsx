import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import './App.css';
import TrendsPage from './pages/TrendsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trends" element={<TrendsPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;