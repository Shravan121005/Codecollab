import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import styles from '../../styles';

function Login({ onLogin }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setError('');
        try {
            const res = await api.post('/auth/login', formData);
            onLogin(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Login failed. Please check your credentials.';
            setError(errorMsg);
        }
    };

    return (
        <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>Login</h2>
            {error && <p style={styles.error}>{error}</p>}
            <form onSubmit={onSubmit}>
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={onChange} required style={styles.input} />
                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={onChange} required style={styles.input} />
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
}

export default Login;

