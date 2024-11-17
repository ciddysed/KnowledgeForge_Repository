import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa"; // Icons for better visual feedback

const Students = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Fetch the list of students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/students");
        if (response.ok) {
          const data = await response.json();
          setStudents(data);
        } else {
          console.error("Failed to fetch students");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  // Handle the Accept button click
  const handleAccept = (student) => {
    setSelectedStudent(student);
    const confirmAcceptance = window.confirm(
      `Do you want to accept this student: ${student.username}?`
    );
    if (confirmAcceptance) {
      alert(`Student ${student.username} accepted.`);
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "800px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "20px",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Students Waiting for Acceptance
      </h1>
      {selectedStudent && (
        <div
          style={{
            backgroundColor: "#e9f7ef",
            border: "1px solid #c3e6cb",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "20px",
            textAlign: "center",
            color: "#155724",
          }}
        >
          <h2>Selected Student: {selectedStudent.username}</h2>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {students.length === 0 ? (
          <p
            style={{
              textAlign: "center",
              fontSize: "18px",
              color: "#888",
              marginTop: "20px",
            }}
          >
            No students available to accept.
          </p>
        ) : (
          students.map((student) => (
            <div
              key={student.studentID}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 rgba(0, 0, 0, 0)")
              }
            >
              <p style={{ margin: "0", fontSize: "16px", color: "#555" }}>
                <strong>Username:</strong> {student.username}
              </p>
              <p style={{ margin: "0", fontSize: "16px", color: "#555" }}>
                <strong>Email:</strong> {student.email}
              </p>
              <button
                style={{
                  backgroundColor: "#28a745",
                  color: "#fff",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 12px",
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#218838")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#28a745")
                }
                onClick={() => handleAccept(student)}
              >
                Accept <FaCheckCircle style={{ fontSize: "16px" }} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Students;
