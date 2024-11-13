import React, { useEffect, useState } from 'react';

// Topic Management Component
const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    topicName: '',
    description: '',
    courseId: '', // Assuming you will pass the course ID
  });
  const [editing, setEditing] = useState(false);
  const [currentTopicId, setCurrentTopicId] = useState(null);

  // Fetch all topics when the component is mounted
  useEffect(() => {
    fetchTopics();
  }, []);

  // Fetch Topics from API
  const fetchTopics = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/topics');
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Error fetching topics:', error);
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

  // Handle form submission to create or update topic
  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiUrl = editing
      ? `http://localhost:8080/api/topics/${currentTopicId}`
      : 'http://localhost:8080/api/topics';
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
        setCurrentTopicId(null);
        fetchTopics();
        setFormData({
          topicName: '',
          description: '',
          courseId: '',
        });
        alert('Topic saved successfully');
      } else {
        alert('Failed to save topic');
      }
    } catch (error) {
      console.error('Error saving topic:', error);
    }
  };

  // Handle edit topic
  const handleEdit = (topic) => {
    setEditing(true);
    setCurrentTopicId(topic.topicID);
    setFormData({
      topicName: topic.topicName,
      description: topic.description,
      courseId: topic.course ? topic.course.courseID : '', // Assuming course ID is available
    });
  };

  // Handle delete topic
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/topics/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTopics();
        alert('Topic deleted successfully');
      } else {
        alert('Failed to delete topic');
      }
    } catch (error) {
      console.error('Error deleting topic:', error);
    }
  };

  return (
    <div className="topic-management">
      <h2>{editing ? 'Edit Topic' : 'Add New Topic'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="topicName">Topic Name:</label>
          <input
            type="text"
            id="topicName"
            name="topicName"
            value={formData.topicName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseId">Course ID:</label>
          <input
            type="text"
            id="courseId"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">{editing ? 'Update Topic' : 'Add Topic'}</button>
      </form>

      <h3>Existing Topics</h3>
      <ul>
        {topics.map((topic) => (
          <li key={topic.topicID}>
            <strong>{topic.topicName}</strong> - {topic.description}
            <button onClick={() => handleEdit(topic)}>Edit</button>
            <button onClick={() => handleDelete(topic.topicID)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopicManagement;
