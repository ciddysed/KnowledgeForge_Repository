package com.g1AppDev.KnowledgeForge.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
import com.g1AppDev.KnowledgeForge.Service.HostClassService;
import com.g1AppDev.KnowledgeForge.Entity.HostClass;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/notifications")
public class StudentSelectionController {

    private static final Logger logger = LoggerFactory.getLogger(StudentSelectionController.class);

    @Autowired
    private StudentSelectionService studentSelectionService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private HostClassService hostClassService;

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

    // Assuming you have a method to get the class details
    private Map<String, Object> getClassDetails(Long classId) {
        // Implement the logic to get class details based on classId
        Map<String, Object> classDetails = new HashMap<>();
        // Populate classDetails map with relevant data
        return classDetails;
    }

    // Endpoint to get tutors chosen by a specific student
    @GetMapping("/student/{studentUsername}")
    public List<HostClass> getTutorsForStudent(@PathVariable String studentUsername) {
        List<StudentSelection> selections = studentSelectionService.getTutorsByStudent(studentUsername).stream()
            .filter(StudentSelection::isAccepted) // Ensure only accepted selections are returned
            .collect(Collectors.toList());

        return selections.stream()
            .flatMap((StudentSelection selection) -> hostClassService.getClassesByTutorId(selection.getTutorId().intValue()).stream())
            .collect(Collectors.toList());
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

    @PostMapping("/accept")
    public ResponseEntity<Void> acceptStudent(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        String tutorUsername = payload.get("tutorUsername").toString();
        try {
            studentSelectionService.acceptStudent(studentId, tutorUsername);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error accepting student", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/decline")
    public ResponseEntity<Void> declineStudent(@RequestBody Map<String, Object> payload) {
        Long studentId = Long.valueOf(payload.get("studentId").toString());
        String tutorUsername = payload.get("tutorUsername").toString();
        try {
            studentSelectionService.declineStudent(studentId, tutorUsername);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error declining student", e);
            return ResponseEntity.status(500).build();
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

    @PostMapping("/checkAccess")
    public ResponseEntity<Map<String, Object>> checkStudentAccess(@RequestBody Map<String, Object> payload) {
        String studentUsername = payload.get("studentUsername").toString();
        Long classId = Long.valueOf(payload.get("classId").toString());
        boolean accessGranted = studentSelectionService.checkStudentAccess(studentUsername, classId);
        Map<String, Object> response = new HashMap<>();
        response.put("accessGranted", accessGranted);
        if (accessGranted) {
            // Assuming you have a method to get the class details
            response.put("hostClass", getClassDetails(classId));
        }
        return ResponseEntity.ok(response);
    }
}