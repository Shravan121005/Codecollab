import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import styles from '../../styles';

function Register({ onLogin }) {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoverButton, setHoverButton] = useState(false);
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/register', formData);
            onLogin(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Registration failed. Please try again.';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <h2 style={styles.formTitle}>Create Account</h2>
                <p style={styles.formSubtitle}>Join CodeCollab and start collaborating</p>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={onSubmit}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Full Name" 
                        value={formData.name} 
                        onChange={onChange} 
                        required 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: '#3E3E42', backgroundColor: '#1E1E1E' })}
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="you@example.com" 
                        value={formData.email} 
                        onChange={onChange} 
                        required 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: '#3E3E42', backgroundColor: '#1E1E1E' })}
                    />
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password (min 6 characters)" 
                        value={formData.password} 
                        onChange={onChange} 
                        required 
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: '#3E3E42', backgroundColor: '#1E1E1E' })}
                    />
                    <button 
                        type="submit" 
                        style={{
                            ...styles.button,
                            ...(hoverButton && styles.buttonHover),
                            opacity: loading ? 0.7 : 1
                        }}
                        onMouseEnter={() => !loading && setHoverButton(true)}
                        onMouseLeave={() => setHoverButton(false)}
                        disabled={loading}
                    >
                        {loading ? '⏳ Creating account...' : '✨ Create Account'}
                    </button>
                </form>
                <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '15px', marginTop: '24px', fontWeight: '500' }}>
                    Already have an account? <Link to="/login" style={{ color: '#06B6D4', textDecoration: 'none', fontWeight: '700' }}>Sign in here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;

