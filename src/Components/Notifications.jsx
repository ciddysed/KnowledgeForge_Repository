import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { connectWebSocket, sendNotification, subscribeToTutorAcceptance, subscribeToTutorNotifications } from './WebSocket';

const Notifications = () => {
  const [students, setStudents] = useState([]);
  const [tutorUsername, setTutorUsername] = useState('');
  const [error, setError] = useState(null);
  const ws = useRef(null);

  useEffect(() => {
    const loggedInTutor = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInTutor || !loggedInTutor.username) {
      console.error("No logged in user found in localStorage or username is missing");
      return;
    }

    const tutorUsername = loggedInTutor.username;
    setTutorUsername(tutorUsername);
    console.log(`Logged in tutor username: ${tutorUsername}`);

    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/notifications/${tutorUsername}`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          setError('Failed to fetch students.');
          console.error('Failed to fetch students:', response.statusText);
        }
      } catch (error) {
        setError('Error fetching students. Please try again.');
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();

    ws.current = connectWebSocket(() => {
      console.log('WebSocket connected, ready to subscribe to notifications');
      subscribeToTutorNotifications(tutorUsername, (message) => {
        try {
          console.log("Received message:", message); // Log incoming messages for debugging
          const newStudent = message;
          if (newStudent && newStudent.studentName && newStudent.courseName) {
            setStudents((prevStudents) => [...prevStudents, newStudent]);

            // Show a toast notification for the new student
            toast.success(`New student selected you: ${newStudent.studentName}`);
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
          toast.error('Error processing the notification.');
        }
      });

      // Subscribe to notifications when a student is accepted by a tutor
      subscribeToTutorAcceptance(tutorUsername, (message) => {
        toast.success(`You have accepted student ${message.studentName}.`);
      });
    });

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [tutorUsername]);

  const handleAccept = async (student) => {
    try {
      sendNotification(student.studentUsername, {
        tutorUsername,
        tutorId: student.tutorId,
        type: 'ACCEPTED',
        tutorName: tutorUsername
      });

      // Notify the student in real-time
      sendNotification(`acceptance/${student.studentUsername}`, {
        tutorName: tutorUsername
      });

      toast.success(`Student ${student.studentName} accepted.`);
    } catch (error) {
      console.error("Error sending acceptance notification:", error);
      toast.error("Failed to send acceptance notification.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <ToastContainer /> {/* Toast container for displaying notifications */}
      <h1>Students Who Chose You as a Tutor</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {students.length === 0 ? (
        <p>No students have selected you yet.</p>
      ) : (
        <div>
          {students.map((student) => (
            <div key={student.id} style={{ border: "1px solid #ddd", padding: "10px", marginBottom: "10px", borderRadius: "5px" }}>
              <p><strong>Student Name:</strong> {student.studentName}</p>
              <p><strong>Course Name:</strong> {student.courseName}</p>
              <button
                style={{
                  padding: "10px",
                  border: "none",
                  borderRadius: "5px",
                  backgroundColor: "#28a745",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#218838")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
                onClick={() => handleAccept(student)}
              >
                Accept <FaCheckCircle style={{ fontSize: "16px" }} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;