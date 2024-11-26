import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import About from "./Components/About";
import Contact from "./Components/Contact";
import CourseManagement from "./Components/CourseManagement";
import Footer from "./Components/Footer";
import Home from "./Components/Home";
import Home1 from "./Components/Home1";
import Home2 from "./Components/Home2";
import LoginPage from "./Components/LoginPage";
import LoginStudent from "./Components/LoginStudent";
import LoginTutor from "./Components/LoginTutor";
import ModuleManagement from "./Components/ModuleManagement";
import Navbar from "./Components/Navbar";
import QuizManagement from "./Components/QuizManagement";
import RegisterStudent from "./Components/RegisterStudent";
import RegisterTutor from "./Components/RegisterTutor";
import Students from "./Components/Students";
import Testimonial from "./Components/Testimonial";
import TopicManagement from "./Components/TopicManagement";
import Search from "./Components/TutorSearch";
import Work from "./Components/Work";
import TutorProfile from "./Components/TutorProfile";
import TutorHome from "./Components/TutorSpecific/TutorHome";
import TutorCourse from "./Components/TutorSpecific/TutorCourse";
import NavbarStudent from "./Components/NavbarStudent";
import NavbarTutor from "./Components/NavbarTutor";

function App() {
  const location = useLocation();

  // Conditional Navbar rendering
  const getNavbar = () => {
    if (location.pathname === "/" 
      || location.pathname === "/LoginPage" 
      || location.pathname === "/loginStudent"
      || location.pathname === "/LoginTutor"
      || location.pathname === "/registerStudent"
      || location.pathname === "/RegisterTutor") {
      return <Navbar />; // Navbar only for Home.jsx
    }
    if (location.pathname === "/home1" || location.pathname === "/Search") {
      return <NavbarStudent />; // NavbarStudent for Home1 and Students
    }
    if (location.pathname === "/home2") {
      return <NavbarTutor />; // NavbarTutor for Home2
    }
    return null; // No Navbar for other components
  };

  return (
    <div className="App">
      {getNavbar()}
      <Routes>
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/work" element={<Work />} />
        <Route path="/testimonial" element={<Testimonial />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/loginStudent" element={<LoginStudent />} />
        <Route path="/registerStudent" element={<RegisterStudent />} />
        <Route path="/loginTutor" element={<LoginTutor />} />
        <Route path="/registerTutor" element={<RegisterTutor />} />
        <Route path="/home1" element={<Home1 />} />
        <Route path="/courseManagement" element={<CourseManagement />} />
        <Route path="/topicManagement" element={<TopicManagement />} />
        <Route path="/quizManagement" element={<QuizManagement />} />
        <Route path="/moduleManagement" element={<ModuleManagement />} />
        <Route path="/search" element={<Search />} />
        <Route path="/students" element={<Students />} /> {/* NavbarStudent applied here */}
        <Route path="/home2" element={<Home2 />} />
        <Route path="/tutor-profile/:tutorId" element={<TutorProfile />} />
        <Route path="/tutorHome" element={<TutorHome />} />
        <Route path="/tutorCourse" element={<TutorCourse />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
