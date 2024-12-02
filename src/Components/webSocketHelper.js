import { io } from 'socket.io-client';

// The URL of your backend WebSocket server
const SOCKET_URL = 'http://localhost:8080/ws'; // Ensure this URL is correct
let socket = null;

export const establishSocketConnection = () => {
  if (!socket) {
    // Create a socket connection using Socket.io
    socket = io(SOCKET_URL, {
      transports: ['websocket'], // Use WebSocket as the transport method
      reconnectionDelayMax: 10000, // Optional: to handle reconnection attempts
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    socket.on('reconnect', (attemptNumber) => {
      console.log(`Reconnected after ${attemptNumber} attempts`);
    });
  }
};

// Now, let's handle subscribing to notifications using Socket.io
export const subscribeToNotifications = (topic, callback) => {
  if (!socket || socket.connected === false) {
    console.warn('WebSocket connection not established');
    return;
  }

  // Subscribe to the topic using Socket.io
  socket.emit('subscribe', { topic });

  socket.on(topic, (data) => {
    // Ensure that the message corresponds to the subscribed topic
    if (data.topic === topic) {
      callback(data.message);
    }
  });
};

// Method to handle real-time notifications for tutor acceptance
export const subscribeToTutorAcceptance = (studentUsername, callback) => {
  if (!socket || socket.connected === false) {
    console.warn('WebSocket connection not established');
    return;
  }

  const topic = `acceptance/${studentUsername}`;
  socket.on(topic, (data) => {
    callback(data);
  });
};

// This method can be used to send notifications to the server
export const sendNotification = (topic, message) => {
  if (!socket || socket.connected === false) {
    console.warn('WebSocket connection not established');
    return;
  }

  // Sending a notification message to the server on a specific topic using Socket.io
  socket.emit('sendNotification', { topic, message });
};

// Method to close the socket connection when you're done
export const closeSocketConnection = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    console.log('Disconnected from WebSocket server');
  }
};