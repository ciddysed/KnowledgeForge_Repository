import './App.css';
// Import your components
import Course from './Course.jsx';
import TutorRegister from './TutorRegister.jsx';
import StudentRegister from './StudentRegister.jsx';
import TutorLogin from './TutorLogin.jsx';
import StudentLogin from './StudentLogin.jsx';
import { useState } from 'react';

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Course':
        return <Course />;
      case 'TutorRegister':
        return <TutorRegister />;
      case 'StudentRegister':
        return <StudentRegister />;
      case 'TutorLogin':
        return <TutorLogin />;
      case 'StudentLogin':
        return <StudentLogin />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      {!selectedComponent ? (
        <div className="landing-page">
          <h1>Welcome to the Learning Platform</h1>
          <div className="button-container">
            <button onClick={() => setSelectedComponent('Course')}>Course</button>
            <button onClick={() => setSelectedComponent('TutorRegister')}>Tutor Register</button>
            <button onClick={() => setSelectedComponent('StudentRegister')}>Student Register</button>
            <button onClick={() => setSelectedComponent('TutorLogin')}>Tutor Login</button>
            <button onClick={() => setSelectedComponent('StudentLogin')}>Student Login</button>
          </div>
        </div>
      ) : (
        <div className="component-view">
          <button onClick={() => setSelectedComponent(null)}>Back to Landing Page</button>
          {renderComponent()}
        </div>
      )}
    </div>
  );
}

export default App;
