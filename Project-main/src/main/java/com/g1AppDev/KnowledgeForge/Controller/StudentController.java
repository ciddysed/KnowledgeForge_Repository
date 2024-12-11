package com.g1AppDev.KnowledgeForge.Controller;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.g1AppDev.KnowledgeForge.Entity.Student;
import com.g1AppDev.KnowledgeForge.Service.StudentService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/students")
public class StudentController {

    private static final Logger logger = LoggerFactory.getLogger(StudentController.class);
    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // Register (Create) Student
    @PostMapping("/register")
    public ResponseEntity<Student> createStudent(@RequestParam("username") String username,
                                                 @RequestParam("password") String password,
                                                 @RequestParam("studentName") String studentName,
                                                 @RequestParam("email") String email,
                                                 @RequestParam("courseYear") String courseYear,
                                                 @RequestParam("city") String city,
                                                 @RequestParam("age") int age,
                                                 @RequestParam(value = "profilePicture", required = false) MultipartFile profilePicture) {
        logger.info("Received registration request: {}", username);
        Student student = new Student();
        student.setUsername(username);
        student.setPassword(password);
        student.setStudentName(studentName);
        student.setEmail(email);
        student.setCourseYear(courseYear);
        student.setCity(city);
        student.setAge(age);

        if (profilePicture != null && !profilePicture.isEmpty()) {
            try {
                String imagePath = saveProfileImage(profilePicture, student.getStudentID());
                student.setProfileImage(imagePath);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
            }
        }

        Student createdStudent = studentService.registerStudent(student);
        return new ResponseEntity<>(createdStudent, HttpStatus.CREATED);
    }

    // Login Student
    @PostMapping("/login")
    public ResponseEntity<Student> login(@RequestParam String username, @RequestParam String password) {
        Optional<Student> student = studentService.loginStudent(username, password);
        return student.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // Get Student by ID
    @GetMapping("/findStudent/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable int id) {
        Optional<Student> student = studentService.findStudentById(id);
        return student.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get All Students
    @GetMapping
    public ResponseEntity<List<Student>> getAllStudents() {
        List<Student> students = studentService.findAllStudents();
        return ResponseEntity.ok(students);
    }

    // Get Student Profile
    @GetMapping("/profile")
    public ResponseEntity<?> getStudentProfile(@RequestParam String username) {
    try {
        Student student = studentService.getStudentByUsername(username);
        if (student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
        }
        return ResponseEntity.ok(student);
    } catch (Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching student profile: " + ex.getMessage());
    }
    }


    // Update Student
    @PutMapping("/update/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable int id, @RequestBody Student updatedStudent) {
        Student student = studentService.updateStudent(id, updatedStudent);
        if (student != null) {
            return ResponseEntity.ok(student);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Update Student Profile
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestParam int userId, 
                                           @RequestParam(required = false) MultipartFile profileImage,
                                           @RequestParam String name,
                                           @RequestParam String email,
                                           @RequestParam String password,
                                           @RequestParam String courseYear,
                                           @RequestParam String city,
                                           @RequestParam int age) {
        try {
            // Handle profile image upload if exists
            String imagePath = null;
            if (profileImage != null && !profileImage.isEmpty()) {
                imagePath = saveProfileImage(profileImage, userId); // Save the image to disk
            }
            
            // Retrieve the student to update
            Optional<Student> studentOptional = studentService.findStudentById(userId);
            if (!studentOptional.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
            }
            
            Student student = studentOptional.get();
            // Update fields
            student.setStudentName(name);
            student.setEmail(email);
            student.setPassword(password);
            student.setCourseYear(courseYear);
            student.setCity(city);
            student.setAge(age);
            
            // If an image was uploaded, update the profile image path
            if (imagePath != null) {
                student.setProfileImage(imagePath); // Save the profile image path
            }
            
            // Save the updated student
            studentService.saveUser(student);  // Assuming saveUser persists the updated student

            // Return the updated student object with profile image URL
            return ResponseEntity.ok(student); 
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating profile: " + ex.getMessage());
        }
    }

    // Method to save the uploaded image to the server
    private String saveProfileImage(MultipartFile profileImage, int userId) throws IOException {
        // Define the absolute path to the uploads directory
        String uploadDir = "C:/Users/James Wolfe/Downloads/uploads/profile_images/";

        // Create the directory if it doesn't exist
        File directory = new File(uploadDir);
        if (!directory.exists()) {
            boolean dirCreated = directory.mkdirs();  // Creates the folder if it doesn't exist
            if (!dirCreated) {
                throw new IOException("Failed to create directory for profile images.");
            }
        }

        // Generate a unique filename (use userId to ensure uniqueness)
        String imageFileName = userId + "_" + profileImage.getOriginalFilename();
        File imageFile = new File(uploadDir + imageFileName);

        // Log for debugging
        System.out.println("Saving profile image to: " + imageFile.getAbsolutePath());

        // Save the image to the directory
        profileImage.transferTo(imageFile);

        // Return the relative path of the uploaded image
        return "uploads/profile_images/" + imageFileName;
    }

    // Delete Student
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteStudent(@PathVariable int id) {
        if (studentService.deleteStudent(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
