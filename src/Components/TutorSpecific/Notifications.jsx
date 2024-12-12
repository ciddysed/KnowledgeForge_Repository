import React, { useEffect, useRef, useState } from 'react';
import { FaComments } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  connectWebSocket,
  subscribeToTutorNotifications,
} from '../WebSocket';

Modal.setAppElement('#root');

const Notifications = () => {
  const [students, setStudents] = useState([]);
  const [tutorUsername, setTutorUsername] = useState('');
  const [error, setError] = useState(null);
  const ws = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInTutor = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!loggedInTutor?.username) {
      console.error("No logged-in user found in localStorage or username is missing");
      return;
    }

    const username = loggedInTutor.username;
    setTutorUsername(username);

    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/notifications/${username}`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          setError('Failed to fetch students.');
        }
      } catch (err) {
        setError('Error fetching students. Please try again.');
      }
    };

    fetchStudents();

    ws.current = connectWebSocket(() => {
      subscribeToTutorNotifications(username, (message) => {
        const newStudent = message;
        if (newStudent?.studentName && newStudent?.courseName) {
          setStudents((prevStudents) => [...prevStudents, newStudent]);
          toast.success(`New student selected you: ${newStudent.studentName}`);
        }
      });
    });

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleChat = (student) => {
    navigate(`/chat/${student.studentUsername}`);
  };

  const StudentCard = ({ student }) => (
    <div style={cardStyle}>
      <p>
        <strong>Student Name:</strong> {student.studentName}
      </p>
      <p>
        <strong>Course-Year:</strong> {student.courseYear}
      </p>
      <button
        style={buttonStyle('#007bff', '#0056b3')}
        onClick={() => handleChat(student)}
      >
        Chat <FaComments />
      </button>
    </div>
  );

  const cardStyle = {
    border: '1px solid #ddd',
    padding: '20px',
    marginBottom: '10px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  };

  const buttonStyle = (color, hoverColor) => ({
    padding: '10px 15px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: color,
    color: '#fff',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    marginBottom: '10px',
  });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <ToastContainer />
      <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>
        Students Who Chose You as a Tutor
      </h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {students.length === 0 ? (
        <p>No students have selected you yet.</p>
      ) : (
        students.map((student) => <StudentCard key={student.id} student={student} />)
      )}
    </div>
  );
};

export default Notifications;
