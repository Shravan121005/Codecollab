import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import styles from '../../styles';

const Chat = ({ projectId, socket, currentUser }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messageListRef = useRef(null);

    // This useEffect hook handles the auto-scrolling
    useEffect(() => {
        if (messageListRef.current) {
            // Set the scroll position to the very bottom of the message list
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    }, [messages]); // This runs every time the messages array changes

    // Fetch message history on component mount
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

    // Listen for new messages from the socket
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

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>Project Chat</div>
            {/* Attach the ref here so our useEffect can control its scroll position */}
            <div ref={messageListRef} style={styles.messageList}>
                {messages.map(msg => (
                    <div key={msg.id} style={styles.messageItem}>
                        <strong style={{ color: '#2980b9' }}>{msg.User?.name || 'User'}</strong>
                        <p style={{ margin: '4px 0' }}>{msg.content}</p>
                        <span style={styles.messageTimestamp}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage} style={styles.chatForm}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    style={styles.chatInput}
                />
                <button type="submit" style={styles.chatButton}>Send</button>
            </form>
        </div>
    );
};

export default Chat;
