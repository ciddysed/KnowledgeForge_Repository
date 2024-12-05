package com.g1AppDev.KnowledgeForge.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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

import com.g1AppDev.KnowledgeForge.Entity.Tutor;
import com.g1AppDev.KnowledgeForge.Service.TutorService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/tutors")
public class TutorController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/{tutorId}/choose")
    public ResponseEntity<?> chooseTutor(@PathVariable Long tutorId, @RequestBody String studentName) {
        messagingTemplate.convertAndSend("/topic/tutorNotifications", "Student " + studentName + " has chosen you!");
        return ResponseEntity.ok("Notification sent to tutor!");
    }    


    @Autowired
    private final TutorService tutorService;

    public TutorController(TutorService tutorService) {
        this.tutorService = tutorService;
    }

    // Register (Create) Tutor
    @PostMapping("/register")
    public ResponseEntity<Tutor> createTutor(@RequestBody Tutor tutor) {
        Tutor createdTutor = tutorService.registerTutor(tutor);
        return new ResponseEntity<>(createdTutor, HttpStatus.CREATED);
    }

    // Login Tutor
    @PostMapping("/login")
    public ResponseEntity<Tutor> login(@RequestParam String username, @RequestParam String password) {
        Optional<Tutor> tutor = tutorService.loginTutor(username, password);
        return tutor.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED).build());
    }

    // Get Tutor by ID
    @GetMapping("/findTutor/{id}")
    public ResponseEntity<Tutor> getTutorById(@PathVariable int id) {
        Optional<Tutor> tutor = tutorService.findTutorById(id);
        return tutor.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get Tutor by Username
    @GetMapping("/username/{username}")
    public ResponseEntity<Tutor> getTutorByUsername(@PathVariable String username) {
        Optional<Tutor> tutor = tutorService.findTutorByUsername(username);
        return tutor.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get All Tutors
    @GetMapping
    public ResponseEntity<List<Tutor>> getAllTutors() {
        List<Tutor> tutors = tutorService.findAllTutors();
        return ResponseEntity.ok(tutors);
    }

    // Update Tutor
    @PutMapping("/update/{id}")
    public ResponseEntity<Tutor> updateTutor(@PathVariable int id, @RequestBody Tutor updatedTutor) {
        Tutor tutor = tutorService.updateTutor(id, updatedTutor);
        if (tutor != null) {
            return ResponseEntity.ok(tutor);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Delete Tutor
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTutor(@PathVariable int id) {
        if (tutorService.deleteTutor(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @GetMapping("/{tutorName}")
    public ResponseEntity<List<Tutor>> getTutorByName(@PathVariable String tutorName) {
        List<Tutor> tutors = tutorService.getTutorByName(tutorName);
        if (!tutors.isEmpty()) {
            return ResponseEntity.ok(tutors);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
