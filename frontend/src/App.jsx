import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import styles from './styles';
import { setAuthToken } from './components/services/api';

// Import Components
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Project from './components/project/Project';

function App() {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for token on initial load
    useEffect(() => {
        const tokenFromStorage = localStorage.getItem('token');
        if (tokenFromStorage) {
            setToken(tokenFromStorage);
            setAuthToken(tokenFromStorage);
        }
        setLoading(false);
    }, []);

    const handleLogin = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        setAuthToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setAuthToken(null);
    };

    if (loading) {
        return (
            <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        fontSize: '48px', 
                        marginBottom: '16px',
                        animation: 'spin 2s linear infinite',
                    }}>⚡</div>
                    <p style={{ color: '#94A3B8', fontSize: '16px', fontWeight: '500' }}>Loading CodeCollab...</p>
                </div>
                <style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <Router>
            <div style={{ ...styles.container, minHeight: '100vh', margin: 0, padding: 0 }}>
                <Navbar isAuthenticated={!!token} onLogout={handleLogout} />
                <Routes>
                    <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
                    <Route path="/project/:id" element={token ? <Project token={token} /> : <Navigate to="/login" />} />
                    <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

