import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import api from '../services/api.js';
import styles from '../../styles.js';
import Chat from '../chat/Chat.jsx';
import { jwtDecode } from 'jwt-decode';

const Project = ({ token }) => {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [socket, setSocket] = useState(null);
    const debounceTimeout = useRef(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [newMemberEmail, setNewMemberEmail] = useState('');
    const [showAddFileInput, setShowAddFileInput] = useState(false);
    const [newFilename, setNewFilename] = useState('');
    const [hoverFileItem, setHoverFileItem] = useState(null);

    // Get current user info from JWT
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.user) {
                    setCurrentUser({ id: decoded.user.id, name: decoded.user.name });
                }
            } catch (e) {
                console.error("Invalid token:", e);
                setError("Session authentication error.");
            }
        }
    }, [token]);

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
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);
        newSocket.emit('joinProject', { projectId: id });

        newSocket.on('codeUpdate', (data) => {
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
            newSocket.disconnect();
            if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        };
    }, [id, project, selectedFile]);

    // Debounced handler for code changes
    const handleEditorChange = (value) => {
        setCode(value);
        if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
        debounceTimeout.current = setTimeout(() => {
            if (socket && selectedFile) {
                socket.emit('codeChange', {
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
                if(socket) {
                    socket.emit('codeChange', {
                        projectId: id,
                        fileId: selectedFile.id,
                        content: code,
                    });
                }
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

    if (error) return <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={styles.error}>{error}</p></div>;
    if (!project || !currentUser) return (
        <div style={{ ...styles.container, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#94A3B8' }}>Loading project...</p>
        </div>
    );

    return (
        <div style={styles.editorLayoutThreeCol}>
            {/* Left Sidebar - File List */}
            <div style={styles.fileList}>
                <div style={styles.fileListHeader}>📁 {project.name}</div>
                <button 
                    onClick={() => setShowAddFileInput(!showAddFileInput)} 
                    style={{
                        ...styles.addFileButton,
                        marginBottom: '16px'
                    }}
                    onMouseEnter={(e) => Object.assign(e.target.style, styles.addFileButtonHover)}
                    onMouseLeave={(e) => Object.assign(e.target.style, { ...styles.addFileButton })}
                >
                    {showAddFileInput ? '✕ Cancel' : '+ Add File'}
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
                        <button type="submit" style={styles.addFileSubmit}>✓</button>
                    </form>
                )}
                <div style={{ marginBottom: '16px', borderBottom: '1px solid #334155' }} />
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '12px' }}>Files</div>
                {project.files && project.files.length > 0 ? (
                    project.files.map((file) => (
                        <div 
                            key={file.id} 
                            onClick={() => handleFileSelect(file)} 
                            style={{
                                ...(selectedFile?.id === file.id ? styles.activeFile : styles.fileItem),
                                ...(hoverFileItem === file.id && !selectedFile?.id === file.id && styles.fileItemHover)
                            }}
                            onMouseEnter={() => setHoverFileItem(file.id)}
                            onMouseLeave={() => setHoverFileItem(null)}
                            title={file.filename}
                        >
                            📄 {file.filename}
                        </div>
                    ))
                ) : (
                    <p style={{ fontSize: '13px', color: '#94A3B8', margin: '8px 0' }}>No files yet</p>
                )}
                
                {/* Members Section */}
                <div style={styles.memberSection}>
                    <div style={styles.memberSectionTitle}>👥 Team Members</div>
                    <ul style={styles.memberList}>
                        {project.members && project.members.length > 0 ? (
                            project.members.map(member => (
                                <li key={member.id} style={styles.memberItem}>
                                    <span style={{ fontSize: '12px' }}>👤</span> {member.name}
                                </li>
                            ))
                        ) : (
                            <li style={{ ...styles.memberItem, color: '#94A3B8' }}>Just you</li>
                        )}
                    </ul>
                    <form onSubmit={handleAddMember} style={styles.addFileForm}>
                        <input 
                            type="email" 
                            value={newMemberEmail} 
                            onChange={(e) => setNewMemberEmail(e.target.value)} 
                            placeholder="user@example.com" 
                            style={styles.addFileInput} 
                        />
                        <button type="submit" style={styles.addFileSubmit}>+</button>
                    </form>
                </div>
            </div>

            {/* Center - Editor */}
            <div style={styles.editorContainer}>
                <Editor
                    height="100%"
                    language={selectedFile ? selectedFile.language : 'javascript'}
                    value={code}
                    onChange={handleEditorChange}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: true },
                        fontSize: 13,
                        lineHeight: 20,
                        fontFamily: "'Fira Code', 'Monaco', 'Courier New', monospace",
                    }}
                />
            </div>

            {/* Right Sidebar - Chat */}
            <Chat projectId={id} socket={socket} currentUser={currentUser} />
        </div>
    );
};

export default Project;

