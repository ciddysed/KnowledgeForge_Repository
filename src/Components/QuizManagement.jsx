import React, { useEffect, useState } from 'react';

// Quiz Management Component
const QuizManagement = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    topicId: '', // The ID of the topic this quiz belongs to
  });
  const [editing, setEditing] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(null);

  // Fetch all quizzes when the component is mounted
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Fetch Quizzes from API
  const fetchQuizzes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/quizzes');
      const data = await response.json();
      setQuizzes(data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission to create or update quiz
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Confirmation prompt for updating a quiz
    if (editing) {
      const isConfirmed = window.confirm("Are you sure you want to update this quiz?");
      if (!isConfirmed) return; // If user cancels, exit the function
    }
  
    const apiUrl = editing
      ? `http://localhost:8080/api/quizzes/${currentQuizId}`
      : 'http://localhost:8080/api/quizzes';
    const method = editing ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        setEditing(false);
        setCurrentQuizId(null);
        fetchQuizzes();
        setFormData({ title: '', topicId: '' });
        alert('Quiz saved successfully');
      } else {
        alert('Failed to save quiz');
      }
    } catch (error) {
      console.error('Error saving quiz:', error);
    }
  };
  

  // Handle edit quiz
  const handleEdit = (quiz) => {
    setEditing(true);
    setCurrentQuizId(quiz.quizID);
    setFormData({
      title: quiz.title,
      topicId: quiz.topic ? quiz.topic.topicID : '', // Assuming topic ID is available
    });
  };

  // Handle delete quiz
  const handleDelete = async (id) => {
    // Confirmation prompt for deleting a quiz
    const isConfirmed = window.confirm("Are you sure you want to delete this quiz?");
    if (!isConfirmed) return; // If user cancels, exit the function
  
    try {
      const response = await fetch(`http://localhost:8080/api/quizzes/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        fetchQuizzes();
        alert('Quiz deleted successfully');
      } else {
        alert('Failed to delete quiz');
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
    }
  };
  

  return (
    <div className="quiz-management">
      <h2>{editing ? 'Edit Quiz' : 'Add New Quiz'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Quiz Title:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="topicId">Topic ID:</label>
          <input
            type="text"
            id="topicId"
            name="topicId"
            value={formData.topicId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editing ? 'Update Quiz' : 'Add Quiz'}</button>
      </form>

      <h3>Existing Quizzes</h3>
      <ul>
        {quizzes.map((quiz) => (
          <li key={quiz.quizID}>
            <strong>{quiz.title}</strong> - Topic ID: {quiz.topic ? quiz.topic.topicID : 'No Topic'}
            <button onClick={() => handleEdit(quiz)}>Edit</button>
            <button onClick={() => handleDelete(quiz.quizID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizManagement;
