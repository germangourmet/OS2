import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import Earth3D from './components/Earth3D';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (credentials) => {
    setUser(credentials);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <div className="app">
      <div className="earth-container">
        <Earth3D />
      </div>

      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="dashboard-container">
          <div className="dashboard-header">
            <div className="dashboard-title">Welcome, {user.email}</div>
            <button className="logout-button" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
          <div className="dashboard-content">
            <h1>Main Dashboard</h1>
            <p>You are now connected to Nexus</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
