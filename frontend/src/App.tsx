import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ValidatorPage from './pages/ValidatorPage';
import ValidatorRegisterPage from './pages/ValidatorRegisterPage';
import ValidatorLoginPage from './pages/ValidatorLoginPage';
import WalletConnectPage from './pages/WalletConnectPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/validator-register" element={<ValidatorRegisterPage />} />
          <Route path="/validator-login" element={<ValidatorLoginPage />} />
          <Route path="/wallet-connect" element={<WalletConnectPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/validator" element={<ValidatorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
