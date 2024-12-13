import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

const Messenger = ({ tutorId }) => {
  const [conversations, setConversations] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Fetch conversations when the component mounts
    fetchConversations();
  }, [fetchConversations]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`/api/conversations?tutorId=${tutorId}`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const message = {
      tutorId,
      content: newMessage,
      timestamp: new Date(),
    };

    try {
      const response = await axios.post('/api/conversations', message);
      setConversations([...conversations, response.data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="messenger">
      <div className="chat-window">
        {conversations.map((msg, index) => (
          <div key={index} className="message">
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
        <button onClick={handleSendMessage} className="button">
          Send
        </button>
      </div>
    </div>
  );
};

export default Messenger;