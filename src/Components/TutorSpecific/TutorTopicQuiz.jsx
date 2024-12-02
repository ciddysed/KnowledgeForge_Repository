import React, { useEffect, useState } from 'react';

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: '#2c3e50',
  },
  list: {
    listStyleType: 'none',
    paddingLeft: '0',
  },
  listItem: {
    padding: '10px',
    marginBottom: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#3498db',
    textDecoration: 'underline',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    zIndex: 1000,
    width: '80%',
    maxWidth: '600px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
  },
  form: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  input: {
    padding: '10px',
    marginRight: '10px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    flex: '1',
  },
};

const TutorTopicQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizName, setQuizName] = useState('');
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

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
      if (Array.isArray(data)) {
        setCourses(data);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchTopics = async (courseID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/topics/tutors/${username}/courses/${courseID}/topics`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setTopics((prevTopics) => ({ ...prevTopics, [courseID]: data }));
        setSelectedCourse(courseID);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  };

  const fetchQuizzes = async (topicID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/tutors/${username}/topics/${topicID}/quizzes`);
      const data = await response.json();
      if (Array.isArray(data)) {
        setQuizzes((prevQuizzes) => ({ ...prevQuizzes, [topicID]: data }));
        setSelectedTopic(topicID);
        setIsModalOpen(true);
      } else {
        console.error('Fetched data is not an array:', data);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleAddQuiz = async (topicID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/tutors/${username}/topics/${topicID}/quizzes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizName }),
      });
      if (response.ok) {
        fetchQuizzes(topicID);
        setQuizName('');
      } else {
        const errorData = await response.json();
        console.error('Error adding quiz:', errorData);
      }
    } catch (error) {
      console.error('Error adding quiz:', error);
    }
  };

  const handleEditQuiz = async (quizID) => {
    const updatedQuiz = { ...selectedQuiz, name: 'Updated Quiz Name' }; // Modify as needed
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/tutors/${username}/topics/${selectedTopic}/quizzes/${quizID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedQuiz),
      });
      if (response.ok) {
        const data = await response.json();
        setQuizzes((prevQuizzes) => ({
          ...prevQuizzes,
          [selectedTopic]: prevQuizzes[selectedTopic].map((quiz) =>
            quiz.id === quizID ? data : quiz
          ),
        }));
        setSelectedQuiz(data);
      } else {
        console.error('Failed to update quiz');
      }
    } catch (error) {
      console.error('Error updating quiz:', error);
    }
  };

  const handleDeleteQuiz = async (quizID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/tutors/${username}/topics/${selectedTopic}/quizzes/${quizID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setQuizzes((prevQuizzes) => ({
          ...prevQuizzes,
          [selectedTopic]: prevQuizzes[selectedTopic].filter((quiz) => quiz.id !== quizID),
        }));
        setSelectedQuiz(null);
        setIsModalOpen(false);
      } else {
        console.error('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };

  const handleViewQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setIsQuizModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTopic(null);
    setSelectedQuiz(null);
  };

  const closeQuizModal = () => {
    setIsQuizModalOpen(false);
    setSelectedQuiz(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Manage Your Quizzes</h1>
      <h3 style={styles.header}>Your Courses</h3>
      <ul style={styles.list}>
        {Array.isArray(courses) && courses.map((course) => (
          <li key={course.courseID} style={styles.listItem}>
            <span style={styles.itemName}>{course.courseName}</span>
            <button onClick={() => fetchTopics(course.courseID)} style={styles.button}>
              View Topics
            </button>
          </li>
        ))}
      </ul>

      {selectedCourse && (
        <>
          <h3 style={styles.header}>Topics for {courses.find(course => course.courseID === selectedCourse)?.courseName}</h3>
          <ul style={styles.list}>
            {Array.isArray(topics[selectedCourse]) && topics[selectedCourse].map((topic) => (
              <li key={topic.topicID} style={styles.listItem}>
                <span style={styles.itemName}>{topic.topicName}</span>
                <button onClick={() => fetchQuizzes(topic.topicID)} style={styles.button}>
                  View Quizzes
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {isModalOpen && (
        <>
          <div style={styles.overlay} onClick={closeModal}></div>
          <div style={styles.modal}>
            <h2>Quizzes for {topics[selectedCourse]?.find(topic => topic.topicID === selectedTopic)?.topicName}</h2>
            <div style={styles.form}>
              <input
                type="text"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="Quiz Name"
                style={styles.input}
              />
              <button onClick={() => handleAddQuiz(selectedTopic)} style={styles.button}>
                Add Quiz
              </button>
            </div>
            <ul style={styles.list}>
              {Array.isArray(quizzes[selectedTopic]) && quizzes[selectedTopic].map((quiz) => (
                <li key={quiz.id} style={styles.listItem}>
                  <span style={styles.itemName} onClick={() => handleViewQuiz(quiz)}>{quiz.title}</span>
                  <button onClick={() => handleEditQuiz(quiz.id)} style={styles.button}>
                    Edit
                  </button>
                  <button onClick={() => handleDeleteQuiz(quiz.id)} style={styles.button}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={closeModal} style={{ ...styles.button, backgroundColor: 'gray' }}>
              Close
            </button>
          </div>
        </>
      )}

      {isQuizModalOpen && (
        <>
          <div style={styles.overlay} onClick={closeQuizModal}></div>
          <div style={styles.modal}>
            <h2>{selectedQuiz?.title}</h2>
            <iframe
              src={selectedQuiz?.msFormsUrl}
              width="100%"
              height="500px"
              frameBorder="0"
              title="Quiz"
            ></iframe>
            <button onClick={closeQuizModal} style={{ ...styles.button, backgroundColor: 'gray' }}>
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TutorTopicQuiz;