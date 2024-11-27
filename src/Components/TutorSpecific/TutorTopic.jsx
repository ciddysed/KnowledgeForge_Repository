import React, { useEffect, useState } from 'react';

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' },
  header: { textAlign: 'center', color: '#2c3e50' },
  courseList: { listStyleType: 'none', paddingLeft: '0' },
  courseItem: { padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  courseName: { fontWeight: 'bold' },
  buttonContainer: { display: 'flex', gap: '10px' },
  button: { padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.3s' },
  buttonHover: { backgroundColor: '#2980b9' },
  modal: { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#ffffff', padding: '30px', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)', zIndex: 1000, width: '80%', maxWidth: '500px', transition: 'transform 0.3s ease-in-out' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.6)', zIndex: 999 },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { fontSize: '20px', fontWeight: 'bold', color: '#2c3e50' },
  closeButton: { background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#7f8c8d' },
  modalBody: { marginBottom: '20px', fontSize: '16px', color: '#34495e' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px' },
  actionButton: { padding: '10px 20px', backgroundColor: '#3498db', color: '#ffffff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', transition: 'background-color 0.3s' },
  input: { padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ddd', width: '100%' },
  topicContainer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '5px' },
  topicButtons: { display: 'flex', gap: '10px' },
};

const TutorTopic = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [topicName, setTopicName] = useState('');
  const [topicDescription, setTopicDescription] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsername(userData.username);
      fetchCourses(userData.username);
    }
  }, []);

  const fetchCourses = async (username) => {
    try {
      const response = await fetch(`http://localhost:8080/Course/tutors/${username}/courses`);
      const data = await response.json();
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchTopics = async (courseID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/topics/tutors/${username}/courses/${courseID}/topics`);
      const data = await response.json();
      setTopics(Array.isArray(data) ? data : []);
      setSelectedCourse(courseID);
      setIsTopicModalOpen(true);
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const handleAddTopic = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/topics/tutors/${username}/courses/${selectedCourse}/topics`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicName, description: topicDescription }),
        }
      );
      if (response.ok) {
        setTopicName('');
        setTopicDescription('');
        setIsAddModalOpen(false);
        fetchTopics(selectedCourse);
      }
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const handleDeleteTopic = async (topicID) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/topics/tutors/${username}/courses/${selectedCourse}/topics/${topicID}`,
        { method: 'DELETE' }
      );
      if (response.ok) fetchTopics(selectedCourse);
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  const handleEditTopic = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/topics/tutors/${username}/courses/${selectedCourse}/topics/${selectedTopic.topicID}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicName, description: topicDescription }),
        }
      );
      if (response.ok) {
        setTopicName('');
        setTopicDescription('');
        setIsEditModalOpen(false);
        fetchTopics(selectedCourse);
      }
    } catch (error) {
      console.error('Error editing topic:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Manage Your Topics</h1>
      <h3 style={styles.header}>Your Courses</h3>
      <ul style={styles.courseList}>
        {courses.map((course) => (
          <li key={course.courseID} style={styles.courseItem}>
            <span style={styles.courseName}>{course.courseName}</span>
            <div style={styles.buttonContainer}>
              <button style={styles.button} onClick={() => fetchTopics(course.courseID)}>View Topics</button>
              <button style={styles.button} onClick={() => { setSelectedCourse(course.courseID); setIsAddModalOpen(true); }}>Add Topic</button>
            </div>
          </li>
        ))}
      </ul>

      {isTopicModalOpen && (
        <>
          <div style={styles.overlay} onClick={() => setIsTopicModalOpen(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Topics</h2>
              <button style={styles.closeButton} onClick={() => setIsTopicModalOpen(false)}>✖</button>
            </div>
            <div style={styles.modalBody}>
              {topics.length > 0 ? (
                topics.map((topic) => (
                  <div key={topic.topicID} style={styles.topicContainer}>
                    <span>
                      <strong>{topic.topicName}</strong>: {topic.description}
                    </span>
                    <div style={styles.topicButtons}>
                      <button style={styles.button} onClick={() => { setSelectedTopic(topic); setTopicName(topic.topicName); setTopicDescription(topic.description); setIsEditModalOpen(true); }}>Edit</button>
                      <button style={{ ...styles.button, backgroundColor: '#e74c3c' }} onClick={() => handleDeleteTopic(topic.topicID)}>Delete</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No topics found for this course.</p>
              )}
            </div>
          </div>
        </>
      )}

      {isAddModalOpen && (
        <>
          <div style={styles.overlay} onClick={() => setIsAddModalOpen(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add Topic</h2>
              <button style={styles.closeButton} onClick={() => setIsAddModalOpen(false)}>✖</button>
            </div>
            <div style={styles.modalBody}>
              <input style={styles.input} value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic Name" />
              <textarea style={styles.input} value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} placeholder="Topic Description" />
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.actionButton} onClick={handleAddTopic}>Add Topic</button>
            </div>
          </div>
        </>
      )}

      {isEditModalOpen && (
        <>
          <div style={styles.overlay} onClick={() => setIsEditModalOpen(false)} />
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Edit Topic</h2>
              <button style={styles.closeButton} onClick={() => setIsEditModalOpen(false)}>✖</button>
            </div>
            <div style={styles.modalBody}>
              <input style={styles.input} value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic Name" />
              <textarea style={styles.input} value={topicDescription} onChange={(e) => setTopicDescription(e.target.value)} placeholder="Topic Description" />
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.actionButton} onClick={handleEditTopic}>Save Changes</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TutorTopic;
