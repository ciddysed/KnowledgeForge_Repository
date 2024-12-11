package com.g1AppDev.KnowledgeForge.Service;

import java.util.List;
import java.util.NoSuchElementException;
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

    public Student getStudentByUsername(String username) {

        // Implement the logic to retrieve a student by username

        // For example, you can use a repository to fetch the student from the database

        Optional<Student> studentOptional = studentRepository.findByUsername(username);
        return studentOptional.orElse(null);
    }

    public void saveUser(Student student) {
        studentRepository.save(student);
    }

    public Student updateUser(int userId, Student newUserDetails) {
        Student user = new Student();
        try {
            user = studentRepository.findById(userId).get();  // Find user by ID

            // Update the user details
            user.setUsername(newUserDetails.getUsername());
            user.setEmail(newUserDetails.getEmail());
            user.setPassword(newUserDetails.getPassword());

            // Update the profile image if it's not null
            if (newUserDetails.getProfileImage() != null) {
                // Set the new profile image path
                user.setProfileImage(newUserDetails.getProfileImage());
            }

        } catch (NoSuchElementException ex) {
            throw new NoSuchElementException("User with ID " + userId + " does not exist!");
        }
        // Save the updated user to the database
        return studentRepository.save(user);
    }

}