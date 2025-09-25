import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { io } from 'socket.io-client';
import api from '../services/api.js';
import styles from '../../styles.js';
import Chat from '../chat/Chat.jsx';
import { jwtDecode } from 'jwt-decode'; // Corrected import for this package

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

    // Get current user info from JWT
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

    // PHASE 3 CHANGE: Update the loading condition.
    // The component now waits until both the project details AND the current user's
    // information have been loaded before attempting to render the main UI.
    if (error) return <p style={styles.error}>{error}</p>;
    if (!project || !currentUser) return <p>Loading project...</p>;

return (
        // PHASE 3 CHANGE: The main container's style is updated to a new three-column layout
        // to accommodate the file list, the editor, and the new chat sidebar.
        <div style={styles.editorLayoutThreeCol}>
            <div style={styles.fileList}>
                <h3>{project.name}</h3>
                <button onClick={() => setShowAddFileInput(!showAddFileInput)} style={styles.addFileButton}>
                    {showAddFileInput ? 'Cancel' : '+ Add File'}
                </button>
                {showAddFileInput && (
                    <form onSubmit={handleAddNewFile} style={styles.addFileForm}>
                        <input type="text" value={newFilename} onChange={(e) => setNewFilename(e.target.value)} placeholder="filename.js" style={styles.addFileInput} autoFocus />
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
                         <input type="email" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} placeholder="user@example.com" style={styles.addFileInput} />
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
            <Chat projectId={id} socket={socket} currentUser={currentUser} />
        </div>
    );
};

export default Project;

