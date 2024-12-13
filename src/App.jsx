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
import NavbarStudent from "./Components/NavbarStudent";
import NavbarTutor from "./Components/NavbarTutor";
import Home from "./Components/Navigation/Home";
import Navbar from "./Components/Navigation/Navbar";
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

import AdminLogin from "./Components/AdminLogin";
import StudentClassList from './Components/Student/StudentClassList';
import TutorProfile from "./Components/Student/TutorProfile";
import Search from "./Components/Student/TutorSearch";
import ClassView from "./Components/TutorSpecific/ClassView";
import HostClass from "./Components/TutorSpecific/HostClass";
import TutorClasses from "./Components/TutorSpecific/TutorClasses";
import TutorCourse from './Components/TutorSpecific/TutorCourse';
import TutorHome from './Components/TutorSpecific/TutorHome';
import TutorTopic from "./Components/TutorSpecific/TutorTopic";
import Work from "./Components/Work";
// import StudentClassView from './Components/Student/StudentClassView';
import ModuleList from './Components/Student/ModuleList'; // Ensure this import is correct



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
      return <Navbar />; // Navbar only for Home
    }
    if (location.pathname === "/studentHome" 
      || location.pathname === "/Search"
      || location.pathname === "/studentClassList"
      || location.pathname === "/bookedTutors"
      || location.pathname === "/chat/:tutorUsername") {
      return <NavbarStudent />; // NavbarStudent
    }
    if (location.pathname === "/tutorHome"
      || location.pathname === "/tutorCourse"
      || location.pathname === "/tutorTopic"
      || location.pathname === "/notifications"
      || location.pathname === "/hostClass"
      || location.pathname === "/TutorClasses"
      || location.pathname === "/classView"
      || location.pathname === "/chat/:studentUsername") {
      return <NavbarTutor />; // NavbarTutor
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
        <Route path="/topicManagement" element={<TopicManagement />} />\
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
        <Route path="/chat/:tutorUsername" element={<Chat />} />
        <Route path="/messenger" element={<Messenger />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/hostClass" element={<HostClass />} />
        <Route path="/TutorClasses" element={<TutorClasses />} />
        <Route path="/classView" element={<ClassView />} />
        <Route path="/studentClassList" element={<StudentClassList />} />
        <Route path="/modules/:topicId" element={<ModuleList />} /> {/* Ensure this route is correct */}
        {/* <Route path="/studentClassView/:tutorId" element={<StudentClassView />} /> */}
      </Routes>
      {/* <Footer /> */}
    </div>
  );
}

export default App;