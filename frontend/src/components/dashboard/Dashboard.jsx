import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import styles from '../../styles.js';

function Dashboard({ token }) {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoveredProject, setHoveredProject] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects');
                setProjects(res.data);
                setError(''); 
            } catch (err) {
                setError('Failed to fetch projects.');
                console.error(err);
            }
        };

        if (token) {
            fetchProjects();
        }
    }, [token]);

    const onCreateProject = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/projects', { name: projectName });
            setProjects([...projects, res.data]);
            setProjectName('');
        } catch (err) {
            setError('Failed to create project.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    
    const onDeleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                setProjects(projects.filter(p => p.id !== id));
            } catch (err) {
                setError('Failed to delete project.');
                console.error(err);
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div style={styles.dashboardContainer}>
            <div style={{ marginBottom: '40px' }}>
                <h1 style={styles.dashboardTitle}>My Projects</h1>
                <p style={styles.dashboardSubtitle}>Create, manage, and collaborate on your coding projects</p>
            </div>

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.dashboardCard}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#D4D4D4', marginBottom: '20px', margin: '0 0 20px 0' }}>Create a New Project</h3>
                <form onSubmit={onCreateProject}>
                    <input
                        type="text"
                        placeholder="Enter project name (e.g., React App, API Server)"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        style={styles.input}
                        onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, { borderColor: '#3E3E42', backgroundColor: '#1E1E1E' })}
                        required
                    />
                    <button
                        type="submit"
                        style={{...styles.button, marginTop: '8px'}}
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Project'}
                    </button>
                </form>
            </div>
            
            <div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#D4D4D4', marginTop: '40px', marginBottom: '20px', margin: '40px 0 20px 0' }}>
                    Your Projects {projects.length > 0 && <span style={{ color: '#CE9178' }}>({projects.length})</span>}
                </h3>
                {projects.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 40px',
                        backgroundColor: '#252526',
                        borderRadius: '0px',
                        border: '1px dashed #3E3E42',
                    }}>
                        <p style={{ fontSize: '48px', margin: '0 0 20px 0' }}>📁</p>
                        <h4 style={{ color: '#D4D4D4', margin: '0 0 12px 0', fontSize: '18px', fontWeight: '600' }}>No projects yet</h4>
                        <p style={{ color: '#858585', margin: 0, fontSize: '14px' }}>Create your first project to get started with collaboration</p>
                    </div>
                ) : (
                    <div style={styles.projectList}>
                        {projects.map(project => (
                            <div 
                                key={project.id} 
                                style={{
                                    ...styles.projectItem,
                                    ...(hoveredProject === project.id && styles.projectItemHover)
                                }}
                                onMouseEnter={() => setHoveredProject(project.id)}
                                onMouseLeave={() => setHoveredProject(null)}
                            >
                                <div>
                                    <Link to={`/project/${project.id}`} style={styles.projectLink}>
                                        <h4 style={styles.projectName}>{project.name}</h4>
                                    </Link>
                                    <p style={styles.projectDate}>📅 Created {formatDate(project.createdAt)}</p>
                                </div>
                                <button 
                                    onClick={() => onDeleteProject(project.id)} 
                                    style={styles.deleteButton}
                                    onMouseEnter={(e) => Object.assign(e.target.style, styles.deleteButtonHover)}
                                    onMouseLeave={(e) => Object.assign(e.target.style, { ...styles.deleteButton })}
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;

