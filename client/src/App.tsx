import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import AccountDetails from './components/accounts/AccountDetails';
import Accounts from './components/accounts/Accounts';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/view-accounts" element={<Accounts />} />
        <Route path="/accounts/:accountId" element={<AccountDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
