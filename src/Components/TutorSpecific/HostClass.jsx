import React, { useState, useEffect } from 'react';

const HostClass = () => {
  const [courses, setCourses] = useState([]);
  const [topics, setTopics] = useState([]);
  const [students, setStudents] = useState([]); // Default to an empty array
  const [classes, setClasses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [classDate, setClassDate] = useState('');
  const [description, setDescription] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loggedInTutor = JSON.parse(localStorage.getItem('loggedInUser'));
  const tutorID = loggedInTutor?.tutorID;
  const tutorUsername = loggedInTutor?.username;

  // Fetch Courses, Topics, Students, and Classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch courses for the logged-in tutor
        const coursesRes = await fetch(`http://localhost:8080/Course/tutors/${tutorUsername}/courses`);
        const coursesData = await coursesRes.json();
        setCourses(coursesData);

        // Fetch students for the logged-in tutor
        const studentsRes = await fetch(`http://localhost:8080/api/students/tutor/${tutorID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
        });
        const studentsData = await studentsRes.json();
        setStudents(Array.isArray(studentsData) ? studentsData : []); // Ensure students is an array

        // Fetch classes for the logged-in tutor
        const classesRes = await fetch(`http://localhost:8080/api/classes/tutor/${tutorID}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
        });
        const classesData = await classesRes.json();
        setClasses(classesData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      }
    };

    fetchData();
  }, [tutorID, tutorUsername]);

  // Fetch topics based on the selected course
  useEffect(() => {
    const fetchTopics = async () => {
      if (selectedCourse) {
        try {
          const topicsRes = await fetch(`http://localhost:8080/api/topics/tutors/${tutorUsername}/courses/${selectedCourse}/topics`);
          const topicsData = await topicsRes.json();
          setTopics(topicsData);
        } catch (error) {
          console.error('Error fetching topics:', error);
          setError('Failed to load topics. Please try again later.');
        }
      }
    };

    fetchTopics();
  }, [selectedCourse, tutorUsername]);

  // Handle Hosting a New Class
  const handleHostClass = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedStudent) {
      setError('Please select a student.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/classes/tutor/${tutorID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
        body: JSON.stringify({
          course: { courseID: selectedCourse },
          topic: { topicID: selectedTopic },
          student: { studentID: selectedStudent },
          classDate,
          description,
        }),
      });

      if (response.ok) {
        const newClass = await response.json();
        setSuccess('Class hosted successfully!');
        setClasses((prevClasses) => [...prevClasses, newClass]); // Update classes list
        setSelectedCourse('');
        setSelectedTopic('');
        setSelectedStudent('');
        setClassDate('');
        setDescription('');
      } else {
        const errorData = await response.json();
        console.error('Error from backend:', errorData); // Log backend error
        setError(`Failed to host class: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error occurred while hosting class:', err); // Log general errors
      setError(`An error occurred while hosting the class: ${err.message}`);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333', fontSize: '2rem', marginBottom: '20px' }}>Host a Class</h2>
      {error && <p style={{ color: 'red', textAlign: 'center', fontSize: '1rem', padding: '10px' }}>{error}</p>}
      {success && <p style={{ color: 'green', textAlign: 'center', fontSize: '1rem', padding: '10px' }}>{success}</p>}

      {/* Form to Host a Class */}
      <form onSubmit={handleHostClass} style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="course" style={{ fontSize: '1rem', marginBottom: '5px', color: '#555' }}>Course:</label>
          <select
            id="course"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course.courseID} value={course.courseID}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="topic" style={{ fontSize: '1rem', marginBottom: '5px', color: '#555' }}>Topic:</label>
          <select
            id="topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          >
            <option value="">Select Topic</option>
            {topics.map((topic) => (
              <option key={topic.topicID} value={topic.topicID}>
                {topic.topicName}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="student" style={{ fontSize: '1rem', marginBottom: '5px', color: '#555' }}>Select Student:</label>
          <select
            id="student"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          >
            <option value="">Select Student</option>
            {Array.isArray(students) && students.map((student) => (
              <option key={student.studentID} value={student.studentID}>
                {student.studentName}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="classDate" style={{ fontSize: '1rem', marginBottom: '5px', color: '#555' }}>Class Date:</label>
          <input
            type="datetime-local"
            id="classDate"
            value={classDate}
            onChange={(e) => setClassDate(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="description" style={{ fontSize: '1rem', marginBottom: '5px', color: '#555' }}>Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '1rem', height: '100px' }}
          />
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginTop: '20px',
          }}
        >
          Host Class
        </button>
      </form>

      {/* List of Hosted Classes */}
      <h3 style={{ marginTop: '30px', fontSize: '1.5rem' }}>Your Hosted Classes:</h3>
      {classes.length > 0 ? (
        <ul style={{ paddingLeft: '20px' }}>
          {classes.map((classItem) => (
            <li key={classItem.classID} style={{ marginBottom: '10px' }}>
              <strong>{classItem.course.courseName}</strong> - {classItem.topic.topicName} 
              <br />
              <span>{classItem.classDate}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hosted classes yet.</p>
      )}
    </div>
  );
};

export default HostClass;
