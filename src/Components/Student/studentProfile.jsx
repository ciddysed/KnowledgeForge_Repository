import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios';

const StudentProfile = () => {
  const [student, setStudent] = useState({
    username: '',
    email: '',
    studentName: '',
    courseYear: '',
    city: '',
    age: '',
    profileImage: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch student profile data
    const fetchProfile = async () => {
      try {
        const storedUsername = localStorage.getItem("loggedInUser");
        if (storedUsername) {
          const userData = JSON.parse(storedUsername);
          const response = await axios.get('http://localhost:8080/api/students/profile', {
            params: { username: userData.username }
          });
          setStudent(response.data);
          if (response.data.profileImage) {
            setPreview(`http://localhost:8080/${response.data.profileImage}`);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent({
      ...student,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0]; // Safely access the file
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); // Generate a preview only if the file is valid
    } else {
      console.error("No file selected or file input is invalid.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('userId', student.studentID);
      formData.append('name', student.studentName);
      formData.append('email', student.email);
      formData.append('password', student.password);
      formData.append('courseYear', student.courseYear);
      formData.append('city', student.city);
      formData.append('age', student.age);
      if (selectedFile) {
        formData.append('profileImage', selectedFile);
      }
  
      const response = await axios.put('http://localhost:8080/api/students/update-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        Swal.fire({
          title: 'Success!',
          text: 'Your profile has been updated successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal2-popup-custom',
          },
        });
        setStudent(response.data);
        if (response.data.profileImage) {
          setPreview(`http://localhost:8080/${response.data.profileImage}`);
        }
  
        const profileUpdateEvent = new CustomEvent('profileUpdate', {
          detail: { profileImage: `http://localhost:8080/${response.data.profileImage}` },
        });
        window.dispatchEvent(profileUpdateEvent);
      } else {
        throw new Error('Error updating profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        title: 'Oops!',
        text: `An error occurred while updating your profile: ${error.message}`,
        icon: 'error',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="student-profile-container">
      <IconButton onClick={handleBack} aria-label="Go back" style={{ position: 'absolute', top: 22, left: 25, color: '#ffffff' }}>
        <ArrowBackIcon />
      </IconButton>

      <h2>Your Profile</h2>
      {preview && (
        <div className="profile-image-container">
          <img src={preview} alt="Profile" className="profile-image" />
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={student.username}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={student.email}
            onChange={handleChange}
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="studentName">Student Name:</label>
          <input
            type="text"
            id="studentName"
            name="studentName"
            value={student.studentName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="courseYear">Course Year:</label>
          <input
            type="text"
            id="courseYear"
            name="courseYear"
            value={student.courseYear}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={student.city}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            value={student.age}
            onChange={handleChange}
            required
            min="1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="profileImage">Profile Picture:</label>
          <input
            type="file"
            id="profileImage"
            name="profileImage"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="primary-button">Update Profile</button>
      </form>
      <style>{`
        .student-profile-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: auto; /* Adjust height to auto */
            width: 25%;
            max-width: 800px;
            min-width: 300px;
            padding: 20px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            border-radius: 50px;
            position: absolute;
            top: 53%;
            left: 50%;
            transform: translate(-50%, -50%);
            animation: fadeBlur 2s ease-in-out;
            filter: blur(0px);
        }

        .student-profile-container.with-preview {
            padding-bottom: 40px; /* Increase padding-bottom when preview is displayed */
        }

        .student-profile-container h2 {
            font-size: 2rem;
            color: black;
            margin-bottom: 20px;
            text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.2);
        }

        .profile-display {
          margin-bottom: 20px;
          text-align: left;
          width: 100%;
          max-width: 300px;
        }

        .profile-display p {
          font-size: 1rem;
          color: black;
          margin: 5px 0;
        }

        .profile-image-container {
            margin-bottom: 20px;
        }

        .profile-image {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .form-group {
            margin-bottom: 15px;
            width: 100%;
            text-align: left;
        }

        .form-group label {
            font-size: 1rem;
            color: black;
            margin-bottom: 5px;
            display: block;
        }

        .form-group input {
            width: 100%;
            max-width: 300px;
            padding: 10px;
            font-size: 1rem;
            border: 2px solid #ddd;
            border-radius: 5px;
            outline: none;
            box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-group input:focus {
            border-color: #66a6ff;
            box-shadow: 0 0 6px rgba(102, 166, 255, 0.5);
        }

        .primary-button {
            width: 100%;
            max-width: 300px;
            padding: 10px;
            font-size: 1rem;
            background-color: blue;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
        }

        .primary-button:hover {
            background-color: #45a049;
            transform: scale(1.05);
        }

        .swal2-popup-custom {
          font-family: 'Arial', sans-serif;
          border-radius: 15px;
          background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
          box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
