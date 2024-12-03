import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

let stompClient = null;

export const connectWebSocket = (onConnectedCallback) => {
    const socket = new SockJS('http://localhost:8080/ws'); // Ensure this URL is correct
    stompClient = Stomp.over(socket);

    stompClient.connect({}, (frame) => {
        console.log('WebSocket connected:', frame);
        if (onConnectedCallback) {
            onConnectedCallback();
        }
    }, (error) => {
        console.error('WebSocket connection error:', error);
        // Retry connection after a delay
        setTimeout(() => {
            connectWebSocket(onConnectedCallback);
        }, 5000);
    });
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.disconnect(() => {
            console.log('WebSocket disconnected');
        });
    }
};

// Function to send a message from a specific student to a specific tutor
export const sendNotification = (tutorUsername, studentMessage) => {
    if (stompClient && stompClient.connected) {
        console.log(`Sending notification to tutor: ${tutorUsername}, message: ${studentMessage}`);
        stompClient.send(`/app/notifyTutor/${tutorUsername}`, {}, JSON.stringify(studentMessage));
    } else {
        console.error("WebSocket is not connected. Cannot send notification.");
    }
};

// Function to subscribe to notifications for a specific tutor
export const subscribeToTutorNotifications = (tutorUsername, callback) => {
    if (stompClient && stompClient.connected) {
        console.log(`Subscribing to notifications for tutor: ${tutorUsername}`);
        const destination = `/topic/notification/tutor/${tutorUsername}`;
        stompClient.subscribe(destination, (message) => {
            const parsedMessage = JSON.parse(message.body);
            callback(parsedMessage); // Pass parsed message to callback
        });
    } else {
        console.error("WebSocket is not connected. Cannot subscribe to notifications.");
    }
};

// Function to subscribe to notifications for a specific student
export const subscribeToStudentNotifications = (studentUsername, callback) => {
    if (!studentUsername) {
        console.error("Student username is undefined. Cannot subscribe to notifications.");
        return;
    }
    if (!stompClient || !stompClient.connected) {
        console.error("WebSocket is not connected. Cannot subscribe to notifications.");
        return;
    }
    console.log(`Subscribing to notifications for student: ${studentUsername}`);
    const destination = `/topic/notification/student/${studentUsername}`;
    stompClient.subscribe(destination, (message) => {
        const parsedMessage = JSON.parse(message.body);
        callback(parsedMessage); // Pass parsed message to callback
    });
};

// Function to subscribe to tutor acceptance notifications for a specific student
export const subscribeToTutorAcceptance = (studentUsername, callback) => {
  if (!studentUsername) {
    console.error("Student username is undefined. Cannot subscribe to tutor acceptance notifications.");
    return;
  }
  if (stompClient && stompClient.connected) {
    console.log(`Subscribing to tutor acceptance notifications for student: ${studentUsername}`);
    const destination = `/topic/acceptance/${studentUsername}`;
    stompClient.subscribe(destination, (message) => {
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage); // Pass parsed message to callback
    });
  } else {
    console.error("WebSocket is not connected. Cannot subscribe to tutor acceptance notifications.");
  }
};