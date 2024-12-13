import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NavbarStudent from '../NavbarStudent'; // Import the Navbar
import './ModuleList.css'; // Import the CSS file

const ModuleList = () => {
  const { topicId } = useParams();
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/modules/topic/${topicId}`);
        if (response.ok) {
          const data = await response.json();
          setModules(data);
        } else {
          setError('Failed to fetch modules.');
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchModules();
  }, [topicId]);

  const handleModuleClick = async (moduleID) => {
    const username = JSON.parse(localStorage.getItem('loggedInUser')).username;
    try {
      await fetch(`http://localhost:8080/api/modules/${moduleID}/trackAccess`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ studentUsername: username }),
      });
    } catch (error) {
      console.error('Error tracking module access:', error);
    }
  };

  return (
    <>
      <NavbarStudent /> {/* Add the Navbar */}
      <div className="module-list-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9' }}>
        <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Modules</h1>
        {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
        {modules.length > 0 ? (
          <ul className="module-list" style={{ listStyleType: 'none', padding: '0' }}>
            {modules.map((module) => (
              <li key={module.moduleID} className="module-item" onClick={() => handleModuleClick(module.moduleID)} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '15px', backgroundColor: '#fff', boxShadow: '0 0 10px rgba(0, 0, 0, 0.05)', cursor: 'pointer' }}>
                <p style={{ marginBottom: '10px', color: '#555' }}>Module: {module.moduleName}</p>
                {module.uploadedFileName && (
                  <p>
                    Uploaded File: <a href={`http://localhost:8080/api/modules/uploads/${module.uploadedFileName}`} download target="_blank" rel="noopener noreferrer" style={{ color: '#007BFF' }}>{module.uploadedFileName}</a>
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#777' }}>No modules found.</p>
        )}
      </div>
    </>
  );
};

export default ModuleList;