import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import styles from '../../styles';

const Chat = ({ projectId, socket, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [hoverSend, setHoverSend] = useState(false);
    const messageListRef = useRef(null);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!projectId) return;
            try {
                const res = await api.get(`/projects/${projectId}/messages`);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            }
        };
        fetchMessages();
    }, [projectId]);

    useEffect(() => {
        if (!socket) return;
        socket.on('newMessage', (incomingMessage) => {
            setMessages(prevMessages => [...prevMessages, incomingMessage]);
        });
        return () => {
            socket.off('newMessage');
        };
    }, [socket]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket && currentUser) {
            const optimisticMessage = {
                id: Date.now(),
                content: newMessage,
                createdAt: new Date().toISOString(),
                User: { id: currentUser.id, name: currentUser.name }
            };
            setMessages(prevMessages => [...prevMessages, optimisticMessage]);
            socket.emit('sendMessage', {
                projectId,
                content: newMessage,
                userId: currentUser.id
            });
            setNewMessage('');
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>💬 Project Chat</div>
            <div ref={messageListRef} style={styles.messageList}>
                {messages.length === 0 ? (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#94A3B8',
                        fontSize: '14px',
                        textAlign: 'center',
                        padding: '20px',
                    }}>
                        <div>
                            <p style={{ fontSize: '40px', margin: '0 0 12px 0' }}>👋</p>
                            <p style={{ margin: 0, fontWeight: '500' }}>No messages yet</p>
                            <p style={{ margin: '4px 0 0 0', fontSize: '13px' }}>Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map(msg => (
                        <div 
                            key={msg.id} 
                            style={{
                                ...styles.messageItem,
                                alignSelf: msg.User?.id === currentUser?.id ? 'flex-end' : 'flex-start',
                                backgroundColor: msg.User?.id === currentUser?.id ? 'rgba(99, 102, 241, 0.15)' : '#0F172A',
                                borderLeftColor: msg.User?.id === currentUser?.id ? '#06B6D4' : '#6366F1',
                                borderLeft: '3px solid',
                            }}
                        >
                            <div style={styles.messageAuthor}>
                                {msg.User?.name || 'User'} {msg.User?.id === currentUser?.id && '(you)'}
                            </div>
                            <p style={styles.messageContent}>{msg.content}</p>
                            <span style={styles.messageTimestamp}>
                                {formatTime(msg.createdAt)}
                            </span>
                        </div>
                    ))
                )}
            </div>
            <form onSubmit={handleSendMessage} style={styles.chatForm}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.chatInput}
                    onFocus={(e) => Object.assign(e.target.style, { borderColor: '#6366F1', backgroundColor: '#1E293B' })}
                    onBlur={(e) => Object.assign(e.target.style, { borderColor: '#475569', backgroundColor: '#1E293B' })}
                />
                <button 
                    type="submit" 
                    style={{
                        ...styles.chatButton,
                        ...(hoverSend && styles.chatButtonHover)
                    }}
                    onMouseEnter={() => setHoverSend(true)}
                    onMouseLeave={() => setHoverSend(false)}
                >
                    Send
                </button>
            </form>
        </div>
    );
};

export default Chat;
