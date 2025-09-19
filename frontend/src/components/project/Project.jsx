import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import api from '../services/api.js';
import styles from '../../styles.js';

const Project = ({ token }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const socketRef = useRef(null);
    const debounceTimeout = useRef(null);

    // State for forms
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [showAddFileInput, setShowAddFileInput] = useState(false);
    const [newFilename, setNewFilename] = useState('');

    // Fetch project details
    useEffect(() => {
        const fetchProject = async () => {
            if (!token) return;
            try {
                const res = await api.get(`/projects/${id}`);
                const projectData = res.data;
                if (projectData && projectData.id) {
                    setProject(projectData);
                    if (projectData.files && projectData.files.length > 0) {
                        const firstFile = projectData.files[0];
                        setSelectedFile(firstFile);
                        setCode(firstFile.content);
                    }
                } else {
                    throw new Error('Project not found or access denied');
                }
            } catch (err) {
                setError('Failed to fetch project details.');
            }
        };
        fetchProject();
    }, [id, token]);

    // Handle Socket.IO connection and events
    useEffect(() => {
        if (!project) return;
        socketRef.current = io('http://localhost:5000');
        const socket = socketRef.current;
        socket.emit('joinProject', { projectId: id });

        socket.on('codeUpdate', (data) => {
            if (selectedFile && data.fileId === selectedFile.id) {
                setCode(prevCode => prevCode !== data.content ? data.content : prevCode);
            }
            setProject(prevProject => {
                if (!prevProject) return null;
                const updatedFiles = prevProject.files.map(file =>
                    file.id === data.fileId ? { ...file, content: data.content } : file
                );
                return { ...prevProject, files: updatedFiles };
            });
        });

        return () => {
            socket.disconnect();
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [id, project, selectedFile]);

    // Debounced handler for code changes
    const handleEditorChange = (value) => {
        setCode(value);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            if (socketRef.current && selectedFile) {
                socketRef.current.emit('codeChange', {
                    projectId: id,
                    fileId: selectedFile.id,
                    content: value,
                });
            }
        }, 500);
    };

    // Handler to switch files, ensuring current work is saved
    const handleFileSelect = (fileToSelect) => {
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

        if (selectedFile) {
            const currentFileInState = project.files.find(f => f.id === selectedFile.id);
            if (currentFileInState && currentFileInState.content !== code) {
                socketRef.current.emit('codeChange', {
                    projectId: id,
                    fileId: selectedFile.id,
                    content: code,
                });
                setProject(prevProject => {
                    const updatedFiles = prevProject.files.map(f =>
                        f.id === selectedFile.id ? { ...f, content: code } : f
                    );
                    return { ...prevProject, files: updatedFiles };
                });
            }
        }
        setSelectedFile(fileToSelect);
        setCode(fileToSelect.content);
    };

    // Handler for adding a new file
    const handleAddNewFile = async (e) => {
        e.preventDefault();
        if (newFilename) {
            try {
                const res = await api.post(`/projects/${id}/files`, { filename: newFilename });
                const newFile = res.data;
                setProject(prev => ({ ...prev, files: [...prev.files, newFile] }));
                setSelectedFile(newFile);
                setCode(newFile.content);
                setNewFilename('');
                setShowAddFileInput(false);
            } catch (err) {
                alert('Error: Could not add the new file.');
            }
        }
    };

    // Handler for adding a new member
    const handleAddMember = async (e) => {
        e.preventDefault();
        if (newMemberEmail) {
            try {
                const res = await api.post(`/projects/${id}/members`, { email: newMemberEmail });
                const newMember = res.data;
                setProject(prev => ({ ...prev, members: [...prev.members, newMember] }));
                setNewMemberEmail('');
            } catch (err) {
                const errorMsg = err.response?.data?.msg || 'Could not add member.';
                alert(`Error: ${errorMsg}`);
            }
        }
    };

    if (error) return <p style={styles.error}>{error}</p>;
    if (!project) return <p>Loading project...</p>;

    return (
        <div style={styles.editorLayout}>
            <div style={styles.fileList}>
                <h3>{project.name}</h3>
                <button onClick={() => setShowAddFileInput(!showAddFileInput)} style={styles.addFileButton}>
                    {showAddFileInput ? 'Cancel' : '+ Add File'}
                </button>
                {showAddFileInput && (
                    <form onSubmit={handleAddNewFile} style={styles.addFileForm}>
                        <input
                            type="text"
                            value={newFilename}
                            onChange={(e) => setNewFilename(e.target.value)}
                            placeholder="filename.js"
                            style={styles.addFileInput}
                            autoFocus
                        />
                        <button type="submit" style={styles.addFileSubmit}>Add</button>
                    </form>
                )}
                <hr />
                {project.files && project.files.map((file) => (
                    <div key={file.id} onClick={() => handleFileSelect(file)} style={selectedFile?.id === file.id ? styles.activeFile : styles.fileItem}>
                        {file.filename}
                    </div>
                ))}

                <div style={{ marginTop: '20px' }}>
                    <h4>Members</h4>
                    <ul style={styles.memberList}>
                        {project.members && project.members.map(member => (
                            <li key={member.id} style={styles.memberItem}>{member.name} ({member.email})</li>
                        ))}
                    </ul>
                    <form onSubmit={handleAddMember} style={styles.addFileForm}>
                         <input
                            type="email"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                            placeholder="user@example.com"
                            style={styles.addFileInput}
                        />
                        <button type="submit" style={styles.addFileSubmit}>Add</button>
                    </form>
                </div>
            </div>
            <div style={styles.editorContainer}>
                <Editor
                    height="100%"
                    language={selectedFile ? selectedFile.language : 'javascript'}
                    value={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                />
            </div>
        </div>
    );
};

export default Project;

