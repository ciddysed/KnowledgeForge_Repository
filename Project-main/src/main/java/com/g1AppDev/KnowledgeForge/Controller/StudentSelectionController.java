package com.g1AppDev.KnowledgeForge.Controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g1AppDev.KnowledgeForge.Entity.Student;
import com.g1AppDev.KnowledgeForge.Entity.StudentSelection;
import com.g1AppDev.KnowledgeForge.Service.StudentSelectionService;
import com.g1AppDev.KnowledgeForge.Service.StudentService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/notifications")
public class StudentSelectionController {

    private static final Logger logger = LoggerFactory.getLogger(StudentSelectionController.class);

    @Autowired
    private StudentSelectionService studentSelectionService;

    @Autowired
    private StudentService studentService;

    // Endpoint to get students who selected a particular tutor
    @GetMapping("/{tutorUsername}")
    public List<StudentSelection> getStudentsForTutor(@PathVariable String tutorUsername) {
        List<StudentSelection> selections = studentSelectionService.getStudentsByTutor(tutorUsername);

        // Assuming you have a method to populate student details
        selections.forEach(selection -> {
            Student student = studentService.getStudentByUsername(selection.getStudentUsername());
            selection.setStudentName(student.getStudentName());
            selection.setCourseYear(student.getCourseYear());
        });

        return selections;
    }

    // Endpoint to get tutors chosen by a specific student
    @GetMapping("/student/{studentUsername}")
    public List<StudentSelection> getTutorsForStudent(@PathVariable String studentUsername) {
        return studentSelectionService.getTutorsByStudent(studentUsername);
    }

    @PostMapping("/select")
    public ResponseEntity<StudentSelection> selectTutor(@RequestBody StudentSelection studentSelection) {
        logger.info("Received student selection request: {}", studentSelection);
        try {
            StudentSelection savedSelection = studentSelectionService.saveStudentSelection(studentSelection);
            logger.info("Saved student selection: {}", savedSelection);
            return ResponseEntity.ok(savedSelection);
        } catch (Exception e) {
            logger.error("Error saving student selection", e);
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/cancel/{tutorId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable Long tutorId) {
        try {
            studentSelectionService.deleteStudentSelectionByTutorId(tutorId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error canceling booking", e);
            return ResponseEntity.status(500).build();
        }
    }
}