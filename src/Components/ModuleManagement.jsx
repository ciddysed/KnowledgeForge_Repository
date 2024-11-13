import axios from 'axios';
import React, { useEffect, useState } from 'react';

const ModuleManagement = () => {
  const [modules, setModules] = useState([]);
  const [moduleName, setModuleName] = useState('');
  const [topicID, setTopicID] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [moduleID, setModuleID] = useState(null);

  // Fetch all modules on component mount
  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get('/api/modules');
      setModules(response.data);
    } catch (error) {
      console.error('Error fetching modules:', error);
    }
  };

  const handleCreateModule = async () => {
    if (!moduleName || !topicID) return alert('Please fill in all fields.');

    try {
      const newModule = { moduleName, topic: { id: topicID } }; // Adjusted to match the entity structure
      await axios.post('/api/modules', newModule);
      fetchModules();
      resetForm();
    } catch (error) {
      console.error('Error creating module:', error);
    }
  };

  const handleEditModule = (module) => {
    setEditMode(true);
    setModuleID(module.moduleID);
    setModuleName(module.moduleName);
    setTopicID(module.topic.id); // Assuming `topic` has an `id` field
  };

  const handleUpdateModule = async () => {
    if (!moduleName || !topicID) return alert('Please fill in all fields.');

    try {
      const updatedModule = { moduleName, topic: { id: topicID } }; // Adjusted for structure
      await axios.put(`/api/modules/${moduleID}`, updatedModule);
      fetchModules();
      resetForm();
    } catch (error) {
      console.error('Error updating module:', error);
    }
  };

  const handleDeleteModule = async (id) => {
    try {
      await axios.delete(`/api/modules/${id}`);
      fetchModules();
    } catch (error) {
      console.error('Error deleting module:', error);
    }
  };

  const resetForm = () => {
    setModuleName('');
    setTopicID('');
    setEditMode(false);
    setModuleID(null);
  };

  return (
    <div className="module-management">
      <h2>Module Management</h2>

      <div className="module-form">
        <input
          type="text"
          placeholder="Module Name"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Topic ID"
          value={topicID}
          onChange={(e) => setTopicID(e.target.value)}
        />
        {editMode ? (
          <button onClick={handleUpdateModule}>Update Module</button>
        ) : (
          <button onClick={handleCreateModule}>Create Module</button>
        )}
        <button onClick={resetForm}>Clear</button>
      </div>

      <div className="module-list">
        <h3>All Modules</h3>
        {modules.length > 0 ? (
          modules.map((module) => (
            <div key={module.moduleID} className="module-item">
              <h4>{module.moduleName}</h4>
              <p>Topic ID: {module.topic.id}</p>
              <button onClick={() => handleEditModule(module)}>Edit</button>
              <button onClick={() => handleDeleteModule(module.moduleID)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No modules found.</p>
        )}
      </div>
    </div>
  );
};

export default ModuleManagement;
