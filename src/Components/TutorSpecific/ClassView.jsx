import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ClassView = () => {
  const { state } = useLocation();
  const { hostClass } = state;
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/modules/topic/${hostClass.topic.topicID}`);
        if (response.ok) {
          const data = await response.json();
          setModules(data);
          const files = data.reduce((acc, module) => {
            if (module.uploadedFileName) {
              acc[module.moduleID] = module.uploadedFileName;
            }
            return acc;
          }, {});
          setUploadedFiles(files);
        } else {
          setError('Failed to fetch modules.');
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/notifications/${hostClass.tutor.username}`);
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          setError('Failed to fetch students.');
        }
      } catch (error) {
        console.error('Error fetching students:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchModules();
    fetchStudents();
  }, [hostClass]);

  const handleAddModule = async () => {
    if (newModuleName) {
      try {
        const response = await fetch(`http://localhost:8080/api/modules`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ moduleName: newModuleName, topic: hostClass.topic }),
        });

        if (response.ok) {
          const newModule = await response.json();
          setModules([...modules, newModule]);
          setNewModuleName('');
        } else {
          setError('Failed to add module.');
        }
      } catch (error) {
        console.error('Error adding module:', error);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadFile = async (moduleID) => {
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Only PDF files are allowed.");
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await fetch(`http://localhost:8080/api/modules/${moduleID}/upload`, {
          method: 'POST',
          body: formData,
        });
        if (response.ok) {
          alert('File uploaded successfully');
          setUploadedFiles((prev) => ({
            ...prev,
            [moduleID]: file.name,
          }));
          setFile(null);
        } else {
          setError('Failed to upload file.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        setError('An error occurred. Please try again later.');
      }
    }
  };

  const handleDeleteModule = async (moduleID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/modules/${moduleID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setModules(modules.filter((module) => module.moduleID !== moduleID));
        setUploadedFiles((prev) => {
          const updatedFiles = { ...prev };
          delete updatedFiles[moduleID];
          return updatedFiles;
        });
        alert('Module deleted successfully');
      } else {
        setError('Failed to delete module.');
      }
    } catch (error) {
      console.error('Error deleting module:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleAcceptStudent = async (student) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: student.id, tutorUsername: hostClass.tutor.username }),
      });

      if (response.ok) {
        alert('Student accepted successfully');
        setStudents(students.map((s) => s.id === student.id ? { ...s, accepted: true } : s));
      } else {
        setError('Failed to accept student.');
      }
    } catch (error) {
      console.error('Error accepting student:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  const handleDeclineStudent = async (student) => {
    try {
      const response = await fetch(`http://localhost:8080/api/notifications/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentId: student.id, tutorUsername: hostClass.tutor.username }),
      });

      if (response.ok) {
        alert('Student declined successfully');
        setStudents(students.filter((s) => s.id !== student.id));
      } else {
        setError('Failed to decline student.');
      }
    } catch (error) {
      console.error('Error declining student:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="class-view-container">
      <h1>Class View</h1>
      <h2>Course: {hostClass.course.courseName}</h2>
      <h3>Topic: {hostClass.topic.topicName}</h3>

      <div className="modules-section">
        <h2>Modules</h2>
        {modules.map((module) => (
          <div key={module.moduleID} className="module-card">
            <p>{module.moduleName}</p>
            {uploadedFiles[module.moduleID] && (
              <p>
                Uploaded Files: <a href={`http://localhost:8080/api/modules/uploads/${uploadedFiles[module.moduleID]}`} download target="_blank" rel="noopener noreferrer">{uploadedFiles[module.moduleID]}</a>
              </p>
            )}
            <input type="file" onChange={handleFileChange} />
            <button onClick={() => handleUploadFile(module.moduleID)}>Upload File</button>
            <button onClick={() => handleDeleteModule(module.moduleID)}>Delete Module</button>
          </div>
        ))}
        <input
          type="text"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          placeholder="New Module Name"
        />
        <button onClick={handleAddModule}>Add Module</button>
      </div>

      <div className="students-section" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div className="accepted-students" style={{ width: '45%', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
          <h3>Accepted Students</h3>
          {students.filter(student => student.accepted).map((student) => (
            <div key={student.id} className="student-card" style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <p>{student.studentName}</p>
            </div>
          ))}
        </div>
        <div className="pending-students" style={{ width: '45%', border: '1px solid #ccc', padding: '10px', borderRadius: '4px' }}>
          <h3>Pending Students</h3>
          {students.filter(student => !student.accepted).map((student) => (
            <div key={student.id} className="student-card" style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
              <p>{student.studentName}</p>
              <button onClick={() => handleAcceptStudent(student)} style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Accept</button>
              <button onClick={() => handleDeclineStudent(student)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Decline</button>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="error-message" style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
};

export default ClassView;