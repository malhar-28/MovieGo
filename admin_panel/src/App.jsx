// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';  
import VerifyTicket from './components/VerifyTicket';
import './App.css';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
         <Route path="/verify-ticket" element={<VerifyTicket />} />
      </Routes>
    </Router>
  );
}

export default App;