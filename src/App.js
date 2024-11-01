import { useState } from 'react';
import './App.css';
import Course from './Course.jsx';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import StudentLogin from './StudentLogin.jsx';
import StudentRegister from './StudentRegister.jsx';
import TutorLogin from './TutorLogin.jsx';
import TutorRegister from './TutorRegister.jsx';
import placeholderImage from './assets/home-banner-image.png';

function App() {
  const [selectedComponent, setSelectedComponent] = useState(null);

  const goToLandingPage = () => setSelectedComponent(null);

  const handleLoginSelection = (type) => {
    setSelectedComponent(type === 'Tutor' ? 'TutorLogin' : 'StudentLogin');
  };

  const handleStudentRegister = () => setSelectedComponent('StudentRegister');
  const handleTutorRegister = () => setSelectedComponent('TutorRegister');
  const goToTutorLogin = () => setSelectedComponent('TutorLogin');
  const goToStudentLogin = () => setSelectedComponent('StudentLogin');

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'Course':
        return <Course goToLandingPage={goToLandingPage} />;
      case 'TutorRegister':
        return <TutorRegister goToLoginPage={goToTutorLogin} />;
      case 'StudentRegister':
        return <StudentRegister goToLoginPage={goToStudentLogin} />;
      case 'TutorLogin':
        return <TutorLogin goToLandingPage={goToLandingPage} goToRegisterPage={handleTutorRegister} />;
      case 'StudentLogin':
        return <StudentLogin goToLandingPage={goToLandingPage} onRegisterClick={handleStudentRegister} />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <Navbar />
      {!selectedComponent ? (
        <div className="landing-page">
          <h1>Welcome to KnowledgeForge</h1>
          <h2>Your Online Tutoring System & Tutor Finder</h2>
          <img src={placeholderImage} alt="Education" className="image-zoom" />
          <div className="login-selection">
            <h2>Are you a...</h2>
            <button onClick={() => handleLoginSelection('Tutor')} className="login-button">Tutor</button>
            <button onClick={() => handleLoginSelection('Student')} className="login-button">Student</button>
          </div>
        </div>
      ) : (
        <div className="component-view">
          {renderComponent()}
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
