import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import CourseManagement from "./Components/CourseManagement";
import About from "./Components/Navigation/About";
import Contact from "./Components/Navigation/Contact";
// import Footer from "./Components/Footer";
import Chat from "./Components/Chat/Chat";
import Messenger from "./Components/Chat/Messenger";
import Home1 from "./Components/Home1";
import Home2 from "./Components/Home2";
import LoginPage from "./Components/LoginPage";
import ModuleManagement from "./Components/ModuleManagement";
import Home from "./Components/Navigation/Home";
import Navbar from "./Components/Navigation/Navbar";
import NavbarStudent from "./Components/NavbarStudent";
import NavbarTutor from "./Components/NavbarTutor";
import Testimonial from "./Components/Navigation/Testimonial";
import QuizManagement from "./Components/QuizManagement";
import BookedTutors from "./Components/Student/BookedTutors";
import LoginStudent from "./Components/Student/LoginStudent";
import RegisterStudent from "./Components/Student/RegisterStudent";
import StudentHome from './Components/Student/StudentHome';
import TopicManagement from "./Components/TopicManagement";
import LoginTutor from "./Components/TutorSpecific/LoginTutor";
import Notifications from './Components/TutorSpecific/Notifications';
import RegisterTutor from "./Components/TutorSpecific/RegisterTutor";
import Students from "./Components/TutorSpecific/Students";

import TutorProfile from "./Components/Student/TutorProfile";
import Search from "./Components/Student/TutorSearch";
import TutorCourse from './Components/TutorSpecific/TutorCourse';
import TutorHome from './Components/TutorSpecific/TutorHome';
import TutorTopic from "./Components/TutorSpecific/TutorTopic";
import Work from "./Components/Work";
import AdminLogin from "./Components/AdminLogin";
import HostClass from "./Components/TutorSpecific/HostClass";


function App() {
  const location = useLocation();

  // Conditional Navbar rendering
  const getNavbar = () => {
    if (location.pathname === "/" 
      || location.pathname === "/LoginPage" 
      || location.pathname === "/loginStudent"
      || location.pathname === "/loginTutor"
      || location.pathname === "/registerStudent"
      || location.pathname === "/RegisterTutor"
      || location.pathname === "/about"
      || location.pathname === "/work"
      || location.pathname === "/testimonial"
      || location.pathname === "/contact") {
      return <Navbar />; // Navbar only for Home.jsx
    }
    if (location.pathname === "/studentHome" 
      || location.pathname === "/Search") {
      return <NavbarStudent />; // NavbarStudent for Home1 and Students
    }
    if (location.pathname === "/tutorHome"
      || location.pathname === "/tutorCourse"
      || location.pathname === "/tutorTopic"
      || location.pathname === "/notifications"
      || location.pathname === "/hostClass") {
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
        <Route path="/students" element={<Students />} />
        <Route path="/adminDashboard" element={<Home2 />} />
        <Route path="/tutor-profile/:tutorId" element={<TutorProfile />} />
        <Route path="/tutorHome" element={<TutorHome />} />
        <Route path="/tutorCourse" element={<TutorCourse />} />
        <Route path="/tutorTopic" element={<TutorTopic />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/studentHome" element={<StudentHome />} />
        <Route path="/bookedTutors" element={<BookedTutors />} />
        <Route path="/chat/:studentUsername" element={<Chat />} />
        <Route path="/messenger" element={<Messenger />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/hostClass" element={<HostClass />} />
       
        

      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;