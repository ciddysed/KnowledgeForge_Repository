import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Main Component
const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    topicName: '',
    description: '',
    courseId: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load topics and courses on component mount
  useEffect(() => {
    fetchTopics();
    fetchCourses();
  }, []);

  // Fetch all topics from backend
  const fetchTopics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/api/topics`);
      setTopics(response.data);
    } catch (error) {
      console.error('Error fetching topics:', error);
      setError('Could not fetch topics.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all courses from backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/Course/getCourse`);
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Could not fetch courses.');
    }
  };

  // Handle input change for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Create or update a topic
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Confirmation prompt for updating a topic
    if (isEditing) {
      const isConfirmed = window.confirm("Are you sure you want to update this topic?");
      if (!isConfirmed) return; // If user cancels, exit the function
    }
  
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/topics/${editId}`, formData);
        alert('Topic updated successfully');
      } else {
        await axios.post(`http://localhost:8080/api/topics/addTopic`, formData);
        alert('Topic added successfully');
      }
      setFormData({ topicName: '', description: '', courseId: '' });
      setIsEditing(false);
      fetchTopics();
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Error submitting form.');
    }
  };
  

  // Delete a topic
  const deleteTopic = async (id) => {
    // Confirmation prompt for deleting a topic
    const isConfirmed = window.confirm("Are you sure you want to delete this topic?");
    if (!isConfirmed) return; // If user cancels, exit the function
  
    try {
      await axios.delete(`http://localhost:8080/api/topics/${id}`);
      alert('Topic deleted successfully');
      fetchTopics();
    } catch (error) {
      console.error('Error deleting topic:', error);
      setError('Error deleting topic.');
    }
  };
  

  // Edit a topic
  const handleEdit = (topic) => {
    setFormData({
      topicName: topic.topicName,
      description: topic.description,
      courseId: topic.course.courseID,
    });
    setIsEditing(true);
    setEditId(topic.topicID);
  };

  return (
    <div className="container">
      <h2>Topic Management</h2>
      {error && <p className="text-danger">{error}</p>}
      {/* Form for adding or updating topics */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">  
          <label>Topic Name:</label>
          <input
            type="text"
            name="topicName"
            value={formData.topicName}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-control"
          ></textarea>
        </div>
        <div className="form-group">
          <label>Course:</label>
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="form-control"
            required
          >
            <option value="">Select a course</option>
            {courses.map((course) => (
              <option key={course.courseID} value={course.courseID}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success">
          {isEditing ? 'Update Topic' : 'Add Topic'}
        </button>
      </form>

      <hr />

      {/* Display list of topics */}
      {loading ? (
        <p>Loading topics...</p>
      ) : (
        <table className="table">
  <thead>
    <tr>
      <th style={{ padding: '10px' }}>ID</th>
      <th style={{ padding: '10px' }}>Topic Name</th>
      <th style={{ padding: '10px' }}>Description</th>
      <th style={{ padding: '10px' }}>Course</th>
      <th style={{ padding: '10px' }}>Actions</th>
    </tr>
  </thead>
  <tbody>
    {topics.map((topic) => (
      <tr key={topic.topicID}>
        <td style={{ padding: '10px' }}>{topic.topicID}</td>
        <td style={{ padding: '10px' }}>{topic.topicName}</td>
        <td style={{ padding: '10px' }}>{topic.description}</td>
        <td style={{ padding: '10px' }}>{topic.course.courseName}</td>
        <td style={{ padding: '10px' }}>
        <button 
                onClick={() => handleEdit(topic)} 
                style={{ padding: '5px 10px', marginRight: '10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Edit
              </button>
              <button 
                onClick={() => deleteTopic(topic.topicID)} 
                style={{ padding: '5px 10px', backgroundColor: 'white', color: 'black', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
};

export default TopicManagement;
