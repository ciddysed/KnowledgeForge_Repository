// App.jsx
import "./App.css";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import About from "./Components/About";
import Work from "./Components/Work";
import Testimonial from "./Components/Testimonial";
import Contact from "./Components/Contact";
import Footer from "./Components/Footer";
import LoginPage from "./Components/LoginPage";
import LoginStudent from "./Components/LoginStudent"
import RegisterStudent from "./Components/RegisterStudent"
import LoginTutor from "./Components/LoginTutor";
import RegisterTutor from "./Components/RegisterTutor";
import Home1 from "./Components/Home1"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Navbar />
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
