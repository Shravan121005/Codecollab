import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles.js';

function Navbar({ isAuthenticated, onLogout }) {
    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.navLink}>CodeCollab</Link>
            <div style={{ float: 'right' }}>
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
                        <a href="#!" onClick={onLogout} style={styles.navLink}>Logout</a>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.navLink}>Login</Link>
                        <Link to="/register" style={styles.navLink}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

