
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { connectWebSocket, sendMessage, subscribeToMessages } from '../WebSocket';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Chat = () => {
  const { studentUsername } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = connectWebSocket(() => {
      subscribeToMessages(studentUsername, (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    });

    return () => {
      ws.current?.close();
    };
  }, [studentUsername]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    sendMessage(studentUsername, newMessage);
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'tutor', content: newMessage },
    ]);
    setNewMessage('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <ToastContainer />
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Chat with {studentUsername}
      </h1>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', backgroundColor: '#fff' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: '20px' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          style={{ flex: 1, padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: '10px 15px',
            border: 'none',
            borderRadius: '5px',
            backgroundColor: '#007bff',
            color: '#fff',
            cursor: 'pointer',
            marginLeft: '10px',
          }}
        >Send
        </button>
         
        
      </div>
    </div>
  );
};

export default Chat;