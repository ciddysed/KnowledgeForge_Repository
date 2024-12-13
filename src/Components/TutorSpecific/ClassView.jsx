import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaPen } from 'react-icons/fa'; // Import pen icon
import NavbarTutor from '../NavbarTutor'; // Import the Navbar

const ClassView = () => {
  const { state } = useLocation();
  const { hostClass } = state;
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [students, setStudents] = useState([]);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [editingModuleName, setEditingModuleName] = useState('');
  const [studentProgress, setStudentProgress] = useState({});

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

    const fetchStudentProgress = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/progress/${hostClass.topic.topicID}`);
        if (response.ok) {
          const data = await response.json();
          setStudentProgress(data);
        } else {
          setError('');
        }
      } catch (error) {
        console.error('Error fetching student progress:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchModules();
    fetchStudents();
    fetchStudentProgress();
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

  const handleEditModule = (module) => {
    setEditingModuleId(module.moduleID);
    setEditingModuleName(module.moduleName);
  };

  const handleUpdateModule = async (moduleID) => {
    try {
      const response = await fetch(`http://localhost:8080/api/modules/${moduleID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moduleName: editingModuleName }),
      });

      if (response.ok) {
        const updatedModule = await response.json();
        setModules(modules.map((module) => (module.moduleID === moduleID ? updatedModule : module)));
        setEditingModuleId(null);
        setEditingModuleName('');
      } else {
        setError('Failed to update module.');
      }
    } catch (error) {
      console.error('Error updating module:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <>
      <NavbarTutor /> {/* Add the Navbar */}
      <div className="class-view-container">
        <h1>Class View</h1>
        <div className="class-info">
          <h2>Course: {hostClass.course.courseName}</h2>
          <h3>Topic: {hostClass.topic.topicName}</h3>
        </div>

        <div className="modules-section">
          <h2>Modules</h2>
          {modules.map((module) => (
            <div key={module.moduleID} className="module-card">
              {editingModuleId === module.moduleID ? (
                <div>
                  <input
                    type="text"
                    value={editingModuleName}
                    onChange={(e) => setEditingModuleName(e.target.value)}
                    className="module-input"
                  />
                  <button onClick={() => handleUpdateModule(module.moduleID)} className="save-button">Save</button>
                  <button onClick={() => setEditingModuleId(null)} className="cancel-button">Cancel</button>
                </div>
              ) : (
                <div>
                  <p className="module-name">{module.moduleName} <FaPen onClick={() => handleEditModule(module)} className="edit-icon" /></p>
                </div>
              )}
              {uploadedFiles[module.moduleID] && (
                <p>
                  Uploaded Files: <a href={`http://localhost:8080/api/modules/uploads/${uploadedFiles[module.moduleID]}`} download target="_blank" rel="noopener noreferrer" className="file-link">{uploadedFiles[module.moduleID]}</a>
                </p>
              )}
              <input type="file" onChange={handleFileChange} className="file-input" />
              <button onClick={() => handleUploadFile(module.moduleID)} className="upload-button">Upload File</button>
              <button onClick={() => handleDeleteModule(module.moduleID)} className="delete-button">Delete Module</button>
            </div>
          ))}
          <input
            type="text"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            placeholder="New Module Name"
            className="new-module-input"
          />
          <button onClick={handleAddModule} className="add-button">Add Module</button>
        </div>

        <div className="students-section">
          <div className="accepted-students">
            <h3>Accepted Students</h3>
            {students.filter(student => student.accepted).map((student) => (
              <div key={student.id} className="student-card">
                <p>{student.studentName}</p>
                <div className="progress-bar">
                  <div style={{ width: `${studentProgress[student.id] || 0}%` }} className="progress"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="pending-students">
            <h3>Pending Students</h3>
            {students.filter(student => !student.accepted).map((student) => (
              <div key={student.id} className="student-card">
                <p>{student.studentName}</p>
                <button onClick={() => handleAcceptStudent(student)} className="accept-button">Accept</button>
                <button onClick={() => handleDeclineStudent(student)} className="decline-button">Decline</button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="error-message">{error}</p>}
      </div>
      <style jsx>{`
        .class-view-container {
          margin: 50px auto;
          padding: 20px;
          font-family: 'Roboto', sans-serif;
          background-color: rgba(255, 255, 255, 0);
          border-radius: 25px;
          box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.8);
        }
        h1 {
          text-align: center;
          color: #000000;
          margin-bottom: 20px;
          font-size: 2.5em;
          font-weight: 700;
        }
        .class-info {
          background-color: #ffffff;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.6);
          margin-bottom: 20px;
        }
        .class-info h2, .class-info h3 {
          text-align: center;
          color: #000000;
        }
        .modules-section {
          margin-top: 20px;
        }
        .module-card {
          border: 1px solid #e0e0e0;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 20px;
          background-color: #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          transition: transform 0.2s;
        }
        .module-card:hover {
          transform: translateY(-5px);
        }
        .module-input, .new-module-input {
          padding: 12px;
          margin-bottom: 10px;
          width: 100%;
          border-radius: 5px;
          border: 1px solid #bdc3c7;
          font-size: 1em;
        }
        .save-button, .cancel-button, .upload-button, .delete-button, .add-button, .accept-button, .decline-button {
          padding: 12px 25px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 1em;
          transition: background-color 0.3s;
        }
        .save-button {
          background-color: #27ae60;
          color: white;
          margin-right: 10px;
        }
        .save-button:hover {
          background-color: #2ecc71;
        }
        .cancel-button {
          background-color: #e74c3c;
          color: white;
        }
        .cancel-button:hover {
          background-color: #c0392b;
        }
        .upload-button {
          background-color: #3498db;
          color: white;
          margin-right: 10px;
        }
        .upload-button:hover {
          background-color: #2980b9;
        }
        .delete-button {
          background-color: #e74c3c;
          color: white;
        }
        .delete-button:hover {
          background-color: #c0392b;
        }
        .add-button {
          background-color: #27ae60;
          color: white;
        }
        .add-button:hover {
          background-color: #2ecc71;
        }
        .accept-button {
          background-color: #27ae60;
          color: white;
          margin-right: 10px;
        }
        .accept-button:hover {
          background-color: #2ecc71;
        }
        .decline-button {
          background-color: #e74c3c;
          color: white;
        }
        .decline-button:hover {
          background-color: #c0392b;
        }
        .edit-icon {
          cursor: pointer;
          color: #2980b9;
          margin-left: 10px;
        }
        .file-link {
          color: #2980b9;
        }
        .file-input {
          margin-bottom: 10px;
        }
        .students-section {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        .accepted-students, .pending-students {
          width: 45%;
          border: 1px solid #e0e0e0;
          padding: 20px;
          border-radius: 10px;
          background-color: #ffffff;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
        }
        .student-card {
          margin-bottom: 15px;
          padding: 20px;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          background-color: #f9f9f9;
        }
        .progress-bar {
          width: 100%;
          background-color: #ecf0f1;
          border-radius: 5px;
        }
        .progress {
          background-color: #27ae60;
          height: 12px;
          border-radius: 5px;
        }
        .error-message {
          color: #e74c3c;
          margin-top: 20px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default ClassView;