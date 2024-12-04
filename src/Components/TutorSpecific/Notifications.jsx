import React, { useEffect, useRef, useState } from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  connectWebSocket,
  sendNotification,
  subscribeToTutorAcceptance,
  subscribeToTutorNotifications,
} from '../WebSocket';

Modal.setAppElement('#root');

const Notifications = () => {
  const [students, setStudents] = useState([]);
  const [tutorUsername, setTutorUsername] = useState('');
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [confirmAccept, setConfirmAccept] = useState(null);
  const [confirmDecline, setConfirmDecline] = useState(null);
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

      subscribeToTutorAcceptance(username, (message) => {
        toast.success(`You have accepted student ${message.studentName}.`);
      });
    });

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleAccept = (student) => setConfirmAccept(student);

  const confirmAcceptStudent = async () => {
    if (!confirmAccept) return;

    try {
      sendNotification(confirmAccept.studentUsername, {
        tutorUsername,
        tutorId: confirmAccept.tutorId,
        type: 'ACCEPTED',
        tutorName: tutorUsername,
      });

      toast.success(`Student ${confirmAccept.studentName} accepted.`);
      setConfirmAccept(null);
      setStudents((prev) => prev.filter((s) => s.id !== confirmAccept.id));
      navigate(`/chat/${confirmAccept.studentUsername}`);
    } catch (error) {
      console.error('Error sending acceptance notification:', error);
      toast.error('Failed to send acceptance notification.');
    }
  };

  const handleDecline = (student) => setConfirmDecline(student);

  const confirmDeclineStudent = async () => {
    if (!confirmDecline) return;

    try {
      toast.info(`Student ${confirmDecline.studentName} declined.`);
      setConfirmDecline(null);
      setStudents((prev) => prev.filter((s) => s.id !== confirmDecline.id));
    } catch (error) {
      console.error('Error declining student:', error);
      toast.error('Failed to decline student.');
    }
  };

  const handleViewProfile = (student) => setSelectedStudent(student);

  const closeModal = () => {
    setSelectedStudent(null);
    setConfirmAccept(null);
    setConfirmDecline(null);
  };

  const StudentCard = ({ student }) => (
    <div style={cardStyle}>
      <p>
        <strong>Student Name:</strong> {student.studentName}
      </p>
      <p>
        <strong>Course-Year:</strong> {student.courseYear}
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          style={buttonStyle('#007bff', '#0056b3')}
          onClick={() => handleViewProfile(student)}
        >
          View Profile
        </button>
        <button
          style={buttonStyle('#28a745', '#218838')}
          onClick={() => handleAccept(student)}
        >
          Accept <FaCheckCircle />
        </button>
        <button
          style={buttonStyle('#dc3545', '#c82333')}
          onClick={() => handleDecline(student)}
        >
          Decline <FaTimesCircle />
        </button>
      </div>
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
      {selectedStudent && (
        <Modal isOpen={!!selectedStudent} onRequestClose={closeModal}>
          <h2>Student Information</h2>
          <p>
            <strong>Student Name:</strong> {selectedStudent.studentName}
          </p>
          <p>
            <strong>Course Year:</strong> {selectedStudent.courseYear}
          </p>
          <p>
            <strong>Student Username:</strong> {selectedStudent.studentUsername}
          </p>
          <button style={buttonStyle('#007bff', '#0056b3')} onClick={closeModal}>
            Close
          </button>
        </Modal>
      )}
      {confirmAccept && (
        <Modal isOpen={!!confirmAccept} onRequestClose={closeModal}>
          <h2>Confirm Accept Student</h2>
          <p>
            Are you sure you want to accept{' '}
            <strong>{confirmAccept.studentName}</strong>?
          </p>
          <button style={buttonStyle('#28a745', '#218838')} onClick={confirmAcceptStudent}>
            Yes
          </button>
          <button style={buttonStyle('#dc3545', '#c82333')} onClick={closeModal}>
            No
          </button>
        </Modal>
      )}
      {confirmDecline && (
        <Modal isOpen={!!confirmDecline} onRequestClose={closeModal}>
          <h2>Confirm Decline Student</h2>
          <p>
            Are you sure you want to decline{' '}
            <strong>{confirmDecline.studentName}</strong>?
          </p>
          <button style={buttonStyle('#dc3545', '#c82333')} onClick={confirmDeclineStudent}>
            Yes
          </button>
          <button style={buttonStyle('#28a745', '#218838')} onClick={closeModal}>
            No
          </button>
        </Modal>
      )}
    </div>
  );
};

export default Notifications;
