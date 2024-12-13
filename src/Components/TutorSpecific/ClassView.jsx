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
      <div className="class-view-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Class View</h1>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          <h2 style={{ color: '#555' }}>Course: {hostClass.course.courseName}</h2>
          <h3 style={{ color: '#777' }}>Topic: {hostClass.topic.topicName}</h3>
        </div>

        <div className="modules-section" style={{ marginTop: '20px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Modules</h2>
          {modules.map((module) => (
            <div key={module.moduleID} className="module-card" style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)' }}>
              {editingModuleId === module.moduleID ? (
                <div>
                  <input
                    type="text"
                    value={editingModuleName}
                    onChange={(e) => setEditingModuleName(e.target.value)}
                    style={{ padding: '10px', marginBottom: '10px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
                  />
                  <button onClick={() => handleUpdateModule(module.moduleID)} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                  <button onClick={() => setEditingModuleId(null)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>{module.moduleName} <FaPen onClick={() => handleEditModule(module)} style={{ cursor: 'pointer', color: '#007BFF', marginLeft: '10px' }} /></p>
                </div>
              )}
              {uploadedFiles[module.moduleID] && (
                <p>
                  Uploaded Files: <a href={`http://localhost:8080/api/modules/uploads/${uploadedFiles[module.moduleID]}`} download target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF' }}>{uploadedFiles[module.moduleID]}</a>
                </p>
              )}
              <input type="file" onChange={handleFileChange} style={{ marginBottom: '10px' }} />
              <button onClick={() => handleUploadFile(module.moduleID)} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Upload File</button>
              <button onClick={() => handleDeleteModule(module.moduleID)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete Module</button>
            </div>
          ))}
          <input
            type="text"
            value={newModuleName}
            onChange={(e) => setNewModuleName(e.target.value)}
            placeholder="New Module Name"
            style={{ padding: '10px', marginBottom: '20px', width: '100%', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <button onClick={handleAddModule} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Add Module</button>
        </div>

        <div className="students-section" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <div className="accepted-students" style={{ width: '45%', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Accepted Students</h3>
            {students.filter(student => student.accepted).map((student) => (
              <div key={student.id} className="student-card" style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <p style={{ marginBottom: '10px', color: '#555' }}>{student.studentName}</p>
                <div className="progress-bar" style={{ width: '100%', backgroundColor: '#f3f3f3', borderRadius: '4px' }}>
                  <div style={{ width: `${studentProgress[student.id] || 0}%`, backgroundColor: '#4CAF50', height: '10px', borderRadius: '4px' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="pending-students" style={{ width: '45%', border: '1px solid #ccc', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)' }}>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Pending Students</h3>
            {students.filter(student => !student.accepted).map((student) => (
              <div key={student.id} className="student-card" style={{ marginBottom: '15px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                <p style={{ marginBottom: '10px', color: '#555' }}>{student.studentName}</p>
                <button onClick={() => handleAcceptStudent(student)} style={{ marginRight: '10px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Accept</button>
                <button onClick={() => handleDeclineStudent(student)} style={{ padding: '10px 20px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Decline</button>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="error-message" style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
      </div>
    </>
  );
};

export default ClassView;