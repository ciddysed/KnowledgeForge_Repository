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
    <div className="card">
      <p>
        <strong>Student Name:</strong> {student.studentName}
      </p>
      <p>
        <strong>Course-Year:</strong> {student.courseYear}
      </p>
      <button
        className="button"
        onClick={() => handleChat(student)}
      >
        Chat <FaComments />
      </button>
    </div>
  );

  return (
    <div className="container">
      <ToastContainer />
      <h1 className="title">
        Students Who Chose You as a Tutor
      </h1>
      {error && <p className="error">{error}</p>}
      {students.length === 0 ? (
        <p>No students have selected you yet.</p>
      ) : (
        students.map((student) => <StudentCard key={student.id} student={student} />)
      )}
      <style>
        {`
          .container {
            padding: 20px;
            max-width: 800px;
            margin: 50px auto;
            background-color: rgba(255, 255, 255, 0);
            border-radius: 25px;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.6);
          }
          .title {
            text-align: center;
            margin-bottom: 25px;
            color: #000000;
            font-size: 2em;
            font-weight: bold;
          }
          .error {
            color: red;
            text-align: center;
            margin-bottom: 20px;
          }
          .card {
            border: 1px solid #ddd;
            padding: 20px;
            margin-bottom: 10px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            background-color: #fff;
            transition: transform 0.3s;
          }
          .card:hover {
            transform: translateY(-5px);
          }
          .button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
            transition: background-color 0.3s;
            display: flex;
            align-items: center;
            gap: 5px;
            margin-bottom: 10px;
          }
          .button:hover {
            background-color: #0056b3;
          }
        `}
      </style>
    </div>
  );
};

export default Notifications;
