import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import './Chat.css';

const Chat = () => {
  const { studentUsername } = useParams();
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);

  // Function to handle successful connection
  const onConnected = useCallback(() => {
    stompClientRef.current.subscribe(
      `/user/${studentUsername}/private`,
      onMessageReceived
    );
    console.log('WebSocket connected');
  }, [studentUsername]);

  // Function to connect to WebSocket
  const connectWebSocket = useCallback(() => {
    const Sock = new SockJS('http://localhost:8080/ws');
    stompClientRef.current = over(Sock);
    stompClientRef.current.connect({}, onConnected, (err) => {
      console.error('WebSocket connection error:', err);
    });
  }, [onConnected]);

  // Function to handle incoming messages
  const onMessageReceived = (payload) => {
    try {
      const payloadData = JSON.parse(payload.body);

      const message = {
        sender: payloadData.senderName || 'Unknown',
        content: payloadData.message || '',
        timestamp: payloadData.timestamp || new Date().toISOString(),
        isReply: payloadData.isReply || false,
        isImage: payloadData.isImage || false,
      };

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, message];
        localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error parsing message payload:', error);
    }
  };

  // Auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!studentUsername) {
      alert('Student username is required!');
      return;
    }
    connectWebSocket();
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.disconnect();
        console.log('Disconnected');
      }
    };
  }, [connectWebSocket, studentUsername]);

  // Handle sending a message
  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const message = {
      senderName: 'tutor',
      receiverName: studentUsername,
      message: trimmedMessage,
      status: 'MESSAGE',
      isReply: false,
      isImage: false,
      timestamp: new Date().toISOString(),
    };

    stompClientRef.current.send(
      '/app/private-message',
      {},
      JSON.stringify(message)
    );

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, message];
      localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
      return updatedMessages;
    });

    setNewMessage('');
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat with {studentUsername}</h2>
      </div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === 'tutor' ? 'tutor-message' : 'student-message'} ${msg.isReply ? 'reply-message' : ''}`}
          >
            <div className="message-details">
              <span className="message-sender">{msg.sender}</span>
              <span className="message-timestamp">
                {formatTimestamp(msg.timestamp)}
              </span>
            </div>
            {msg.isImage ? (
              <img src={msg.content} alt="Received" style={{ maxWidth: '100%', borderRadius: '10px' }} />
            ) : (
              <div className="message-content">{msg.content}</div>
            )}
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
          className="input"
        />
        <button
          onClick={handleSendMessage}
          className="button"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
