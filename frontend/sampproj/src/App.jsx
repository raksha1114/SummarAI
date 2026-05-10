import React, { useState, useEffect } from 'react';
import './App.css';

import SignupPage from './signup';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import TextSummarization from './TextSummarization';
import PdfSummarization from './PdfSummarization';
import ChatWithPdf from './ChatWithPdf';

function App() {

  // =========================
  // 🔹 STATE
  // =========================
  const [currentPage, setCurrentPage] = useState('login');

  const [user, setUser] = useState(null);

  // =========================
  // 🔹 AUTO LOGIN
  // =========================
  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {

      setUser(JSON.parse(savedUser));

      setCurrentPage("dashboard");
    }

  }, []);

  // =========================
  // 🔹 SIGNUP SUCCESS
  // =========================
  const handleSignup = (userData) => {

    console.log("Signup Success:", userData);

    // After signup → go login
    setCurrentPage('login');
  };

  // =========================
  // 🔹 LOGIN SUCCESS
  // =========================
  const handleLogin = (userData) => {

    console.log("Login Success:", userData);

    // Save user in state
    setUser(userData);

    // Save in localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Redirect dashboard
    setCurrentPage('dashboard');
  };

  // =========================
  // 🔹 LOGOUT
  // =========================
  const handleLogout = () => {

    localStorage.removeItem("user");

    setUser(null);

    setCurrentPage('login');
  };

  // =========================
  // 🔹 NAVIGATION
  // =========================
  const navigateToPage = (page) => {

    setCurrentPage(page);
  };

  // =========================
  // 🔹 UI
  // =========================
  return (

    <div className="App">

      {currentPage === 'signup' && (

        <SignupPage
          onSignup={handleSignup}
          onSwitchToLogin={() => setCurrentPage('login')}
        />

      )}

      {currentPage === 'login' && (

        <LoginPage
          onLogin={handleLogin}
          onSwitchToSignup={() => setCurrentPage('signup')}
        />

      )}

      {currentPage === 'dashboard' && user && (

        <Dashboard
          user={user}
          onNavigate={navigateToPage}
          onLogout={handleLogout}
        />

      )}

      {currentPage === 'textSummarization' && (

        <TextSummarization
          onBack={() => setCurrentPage('dashboard')}
        />

      )}

      {currentPage === 'pdfSummarization' && (

        <PdfSummarization
          onBack={() => setCurrentPage('dashboard')}
        />

      )}

      {currentPage === 'chatWithPdf' && (

        <ChatWithPdf
          onBack={() => setCurrentPage('dashboard')}
        />

      )}

    </div>
  );
}

export default App;