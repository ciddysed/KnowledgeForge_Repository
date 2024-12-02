package com.g1AppDev.KnowledgeForge.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g1AppDev.KnowledgeForge.Entity.Student;
import com.g1AppDev.KnowledgeForge.Repository.StudentRepo;

@Service
public class StudentService {    

    @Autowired
    private final StudentRepo studentRepository;

    public StudentService(StudentRepo studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Register (Create Student)
    public Student registerStudent(Student student) {
        // Optional: You could add logic here to check if the username or email already exists
        return studentRepository.save(student);
    }

    // Login (Find Student by Username and Password)
    public Optional<Student> loginStudent(String username, String password) {
        return studentRepository.findByUsernameAndPassword(username, password);
    }

    // Find by ID
    public Optional<Student> findStudentById(int id) {
        return studentRepository.findById(id);
    }

    // Find All Students
    public List<Student> findAllStudents() {
        return studentRepository.findAll();
    }

    // Update Student
    public Student updateStudent(int id, Student updatedStudent) {
        Optional<Student> existingStudent = studentRepository.findById(id);
        if (existingStudent.isPresent()) {
            Student student = existingStudent.get();
            student.setUsername(updatedStudent.getUsername());
            student.setEmail(updatedStudent.getEmail());
            student.setPassword(updatedStudent.getPassword()); // Optional: Encrypt password
            return studentRepository.save(student);
        }
        return null;
    }

    // Delete Student
    public boolean deleteStudent(int id) {
        if (studentRepository.existsById(id)) {
            studentRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
