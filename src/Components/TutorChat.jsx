import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Chat.css'; // Import CSS for styling
import { connectWebSocket, disconnectWebSocket, sendNotification, subscribeToStudentNotifications } from './WebSocket';

const TutorChat = () => {
  const { studentUsername } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    ws.current = connectWebSocket(() => {
      console.log('WebSocket connected, ready to subscribe to messages');
      subscribeToStudentNotifications(studentUsername, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    });

    return () => {
      if (ws.current) {
        disconnectWebSocket();
      }
    };
  }, [studentUsername]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const message = {
      sender: 'tutor',
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    sendNotification(studentUsername, message);
    setMessages((prevMessages) => [...prevMessages, message]);
    setNewMessage('');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with {studentUsername}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.sender}`}>
            <div className="message-content">{msg.content}</div>
            <div className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default TutorChat;