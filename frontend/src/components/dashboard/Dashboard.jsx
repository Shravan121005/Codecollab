import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import api from '../services/api.js';
import styles from '../../styles.js';

// --- RECEIVE `token` PROP ---
function Dashboard({ token }) {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [error, setError] = useState('');

    // --- USE `token` AS A DEPENDENCY ---
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Clear any previous errors
                const res = await api.get('/projects');
                setProjects(res.data);
                setError(''); 
            } catch (err) {
                setError('Failed to fetch projects.');
                console.error(err);
            }
        };

        // --- ONLY FETCH IF TOKEN EXISTS ---
        if (token) {
            fetchProjects();
        }
    }, [token]); // Re-run when token becomes available

    const onCreateProject = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/projects', { name: projectName });
            setProjects([...projects, res.data]);
            setProjectName('');
        } catch (err) {
            setError('Failed to create project.');
            console.error(err);
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
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <h1 style={styles.dashboardTitle}>My Dashboard</h1>
            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.dashboardCard}>
                <h2 style={styles.dashboardSubtitle}>Create a New Project</h2>
                <form onSubmit={onCreateProject}>
                    <input
                        type="text"
                        placeholder="Enter Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.button}>Create Project</button>
                </form>
            </div>
            
            <div>
                <h2 style={styles.dashboardSubtitle}>Your Projects</h2>
                <div style={styles.projectList}>
                    {projects.map(project => (
                        <div key={project.id} style={styles.projectItem}>
                            <div>
                                {/* Project name is now a clickable Link */}
                                <Link to={`/project/${project.id}`} style={styles.projectLink}>
                                    {project.name}
                                </Link>
                                <p style={styles.projectDate}>Created on: {formatDate(project.createdAt)}</p>
                            </div>
                            <button onClick={() => onDeleteProject(project.id)} style={styles.deleteButton}>Delete</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

