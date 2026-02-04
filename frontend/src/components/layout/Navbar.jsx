import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles.js';

function Navbar({ isAuthenticated, onLogout }) {
    const [hoverLogout, setHoverLogout] = React.useState(false);
    const [hoverLink, setHoverLink] = React.useState(null);

    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.navBrand}>
                <span style={{ fontSize: '28px' }}>⚡</span> CodeCollab
            </Link>
            <div style={styles.navLinks}>
                {isAuthenticated ? (
                    <>
                        <Link 
                            to="/dashboard" 
                            style={{
                                ...styles.navLink,
                                ...(hoverLink === 'dashboard' && styles.navLinkHover)
                            }}
                            onMouseEnter={() => setHoverLink('dashboard')}
                            onMouseLeave={() => setHoverLink(null)}
                        >
                            Dashboard
                        </Link>
                        <button 
                            onClick={onLogout}
                            style={{
                                ...styles.navButton,
                                ...(hoverLogout && { transform: 'translateY(-2px)' })
                            }}
                            onMouseEnter={() => setHoverLogout(true)}
                            onMouseLeave={() => setHoverLogout(false)}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link 
                            to="/login" 
                            style={{
                                ...styles.navLink,
                                ...(hoverLink === 'login' && styles.navLinkHover)
                            }}
                            onMouseEnter={() => setHoverLink('login')}
                            onMouseLeave={() => setHoverLink(null)}
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register" 
                            style={{
                                ...styles.navButton, 
                                textDecoration: 'none', 
                                display: 'inline-block', 
                                padding: '10px 20px',
                                ...(hoverLink === 'register' && { transform: 'translateY(-2px)' })
                            }}
                            onMouseEnter={() => setHoverLink('register')}
                            onMouseLeave={() => setHoverLink(null)}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;

