import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles';

function LandingPage() {
    const [hoveredFeature, setHoveredFeature] = useState(null);

    const features = [
        {
            id: 1,
            icon: '⚡',
            title: 'Real-Time Collaboration',
            description: 'Code together in real-time with instant sync across all connected collaborators'
        },
        {
            id: 2,
            icon: '💬',
            title: 'Integrated Chat',
            description: 'Communicate with your team without leaving the editor'
        },
        {
            id: 3,
            icon: '📁',
            title: 'File Management',
            description: 'Organize and manage multiple files within your projects seamlessly'
        },
        {
            id: 4,
            icon: '👥',
            title: 'Team Sharing',
            description: 'Invite team members and collaborate on projects together'
        },
        {
            id: 5,
            icon: '🎨',
            title: 'VS Code Experience',
            description: 'Familiar editor interface with syntax highlighting and more'
        },
        {
            id: 6,
            icon: '🔒',
            title: 'Secure & Private',
            description: 'Your code is secure with authentication and access controls'
        }
    ];

    return (
        <div style={{ ...styles.container, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <nav style={styles.nav}>
                <div style={styles.navBrand}>
                    <span style={{ fontSize: '20px' }}>⚡</span> CodeCollab
                </div>
                <div style={styles.navLinks}>
                    <Link to="/login" style={{ ...styles.navLink, textDecoration: 'none' }}>Login</Link>
                    <Link to="/register" style={{ ...styles.navButton, textDecoration: 'none', display: 'inline-block', padding: '8px 16px' }}>Get Started</Link>
                </div>
            </nav>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <section style={{
                    padding: '80px 40px',
                    textAlign: 'center',
                    backgroundColor: '#1E1E1E',
                }}>
                    <h1 style={{
                        fontSize: '56px',
                        fontWeight: '700',
                        color: '#D4D4D4',
                        marginBottom: '20px',
                        lineHeight: '1.2',
                    }}>
                        Collaborate on Code in <span style={{ color: '#CE9178' }}>Real-Time</span>
                    </h1>
                    <p style={{
                        fontSize: '18px',
                        color: '#858585',
                        marginBottom: '40px',
                        maxWidth: '600px',
                        margin: '0 auto 40px',
                    }}>
                        CodeCollab brings your development team together. Write code, chat, and collaborate all in one place.
                    </p>
                    <Link to="/register" style={{
                        display: 'inline-block',
                        padding: '12px 32px',
                        background: '#0E639C',
                        color: '#D4D4D4',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        marginRight: '16px',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                    }} onMouseEnter={(e) => e.target.style.background = '#1177BB'} onMouseLeave={(e) => e.target.style.background = '#0E639C'}>
                        Start Free
                    </Link>
                    <Link to="/login" style={{
                        display: 'inline-block',
                        padding: '12px 32px',
                        border: '1px solid #3E3E42',
                        color: '#D4D4D4',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                    }} onMouseEnter={(e) => {
                        e.target.style.borderColor = '#CE9178';
                        e.target.style.color = '#CE9178';
                    }} onMouseLeave={(e) => {
                        e.target.style.borderColor = '#3E3E42';
                        e.target.style.color = '#D4D4D4';
                    }}>
                        Sign In
                    </Link>
                </section>

                <section style={{
                    padding: '80px 40px',
                    backgroundColor: '#252526',
                }}>
                    <h2 style={{
                        fontSize: '36px',
                        fontWeight: '700',
                        color: '#D4D4D4',
                        marginBottom: '60px',
                        textAlign: 'center',
                    }}>
                        Everything You Need to Collaborate
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '32px',
                        maxWidth: '1200px',
                        margin: '0 auto',
                    }}>
                        {features.map(feature => (
                            <div
                                key={feature.id}
                                style={{
                                    padding: '32px 24px',
                                    backgroundColor: '#1E1E1E',
                                    border: '1px solid #3E3E42',
                                    transition: 'all 0.2s ease',
                                    cursor: 'pointer',
                                    ...(hoveredFeature === feature.id && {
                                        borderColor: '#0E639C',
                                        boxShadow: '0 8px 24px rgba(14, 99, 156, 0.15)',
                                    })
                                }}
                                onMouseEnter={() => setHoveredFeature(feature.id)}
                                onMouseLeave={() => setHoveredFeature(null)}
                            >
                                <div style={{
                                    fontSize: '40px',
                                    marginBottom: '16px',
                                }}>
                                    {feature.icon}
                                </div>
                                <h3 style={{
                                    fontSize: '18px',
                                    fontWeight: '600',
                                    color: '#D4D4D4',
                                    marginBottom: '12px',
                                    margin: '0 0 12px 0',
                                }}>
                                    {feature.title}
                                </h3>
                                <p style={{
                                    fontSize: '14px',
                                    color: '#858585',
                                    lineHeight: '1.6',
                                    margin: 0,
                                }}>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                <section style={{
                    padding: '60px 40px',
                    backgroundColor: '#1E1E1E',
                    textAlign: 'center',
                    borderTop: '1px solid #3E3E42',
                }}>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: '700',
                        color: '#D4D4D4',
                        marginBottom: '20px',
                    }}>
                        Ready to Collaborate?
                    </h2>
                    <p style={{
                        fontSize: '16px',
                        color: '#858585',
                        marginBottom: '32px',
                    }}>
                        Join teams worldwide using CodeCollab for real-time code collaboration
                    </p>
                    <Link to="/register" style={{
                        display: 'inline-block',
                        padding: '12px 40px',
                        background: '#0E639C',
                        color: '#D4D4D4',
                        textDecoration: 'none',
                        fontWeight: '600',
                        fontSize: '16px',
                        transition: 'all 0.2s ease',
                    }} onMouseEnter={(e) => e.target.style.background = '#1177BB'} onMouseLeave={(e) => e.target.style.background = '#0E639C'}>
                        Get Started Now
                    </Link>
                </section>
            </div>

            <footer style={{
                padding: '24px 40px',
                borderTop: '1px solid #3E3E42',
                backgroundColor: '#1E1E1E',
                textAlign: 'center',
                color: '#858585',
                fontSize: '12px',
            }}>
                <p style={{ margin: 0 }}>© 2024 CodeCollab. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
