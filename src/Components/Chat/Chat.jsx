import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import SockJS from 'sockjs-client';
import { over } from 'stompjs';
import './Chat.css';

const Chat = () => {
  const { studentUsername } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tutorUsername, setTutorUsername] = useState('');
  const [privateChats, setPrivateChats] = useState(new Map());
  const [notifications, setNotifications] = useState([]);
  const chatEndRef = useRef(null);
  const stompClientRef = useRef(null);

  const onConnected = useCallback(() => {
    stompClientRef.current.subscribe(
      `/user/${studentUsername}/private`,
      onMessageReceived
    );
    stompClientRef.current.subscribe(
      `/user/${tutorUsername}/private`,
      onMessageReceived
    );
    stompClientRef.current.subscribe(
      `/user/${studentUsername}/notification`,
      onNotification
    );
    stompClientRef.current.subscribe(
      `/user/${tutorUsername}/notification`,
      onNotification
    );
    console.log('WebSocket connected');
  }, [studentUsername, tutorUsername]);

  const connectWebSocket = useCallback(() => {
    const Sock = new SockJS('http://localhost:8080/ws');
    stompClientRef.current = over(Sock);
    stompClientRef.current.connect({}, onConnected, (err) => {
      console.error('WebSocket connection error:', err);
    });
  }, [onConnected]);

  const onMessageReceived = (payload) => {
    try {
      const payloadData = JSON.parse(payload.body);
      const message = {
        sender: payloadData.senderName || 'Unknown',
        content: payloadData.message || '',
        timestamp: payloadData.timestamp || new Date().toISOString(),
        isReply: payloadData.isReply || false,
        isImage: payloadData.isImage || false,
        isCrossMessage: payloadData.isCrossMessage || false,
      };

      if (payloadData.receiverName === studentUsername) {
        setPrivateChats((prevChats) => {
          const updatedChats = new Map(prevChats);
          const senderMessages = updatedChats.get(payloadData.senderName) || [];
          senderMessages.push(message);
          updatedChats.set(payloadData.senderName, senderMessages);
          return updatedChats;
        });
        setNotifications((prev) => [...prev, `New private message from ${payloadData.senderName}`]);
      } else {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    } catch (error) {
      console.error('Error parsing message payload:', error);
    }
  };

  const onNotification = (payload) => {
    const notification = payload.body;
    setNotifications((prev) => [...prev, notification]);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, privateChats]);

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

  const handleSendMessage = () => {
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage) return;

    const message = {
      senderName: studentUsername,
      receiverName: tutorUsername,
      message: trimmedMessage,
      status: 'MESSAGE',
      isReply: false,
      isImage: false,
      timestamp: new Date().toISOString(),
    };

    stompClientRef.current.send(
      `/app/private-message`,
      {},
      JSON.stringify(message)
    );

    setPrivateChats((prevChats) => {
      const updatedChats = new Map(prevChats);
      const tutorMessages = updatedChats.get(tutorUsername) || [];
      tutorMessages.push(message);
      updatedChats.set(tutorUsername, tutorMessages);
      return updatedChats;
    });

    setNewMessage('');
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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
            className={`chat-message ${msg.isCrossMessage ? 'cross-message' : msg.sender === tutorUsername ? 'tutor-message' : 'student-message'} ${msg.isReply ? 'reply-message' : ''}`}
            style={{ alignSelf: msg.sender === studentUsername ? 'flex-end' : 'flex-start' }}
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
