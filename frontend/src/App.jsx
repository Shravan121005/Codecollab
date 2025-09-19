import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import styles from './styles';
import { setAuthToken } from './components/services/api';

// Import Components
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Project from './components/project/Project'; // Make sure this is imported

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
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div style={styles.container}>
                <Navbar isAuthenticated={!!token} onLogout={handleLogout} />
                <Routes>
                    <Route path="/login" element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                    <Route path="/register" element={!token ? <Register onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={token ? <Dashboard token={token} /> : <Navigate to="/login" />} />
                    {/* Pass the token to the Project component */}
                    <Route path="/project/:id" element={token ? <Project token={token} /> : <Navigate to="/login" />} />
                    <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

