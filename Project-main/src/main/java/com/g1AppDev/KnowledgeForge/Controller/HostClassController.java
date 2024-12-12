package com.g1AppDev.KnowledgeForge.Controller;

import com.g1AppDev.KnowledgeForge.Entity.HostClass;
import com.g1AppDev.KnowledgeForge.Service.HostClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/hostclass")
public class HostClassController {

    @Autowired
    private HostClassService hostClassService;

    @PostMapping
    public ResponseEntity<HostClass> addHostClass(@RequestBody HostClass hostClass) {
        HostClass newHostClass = hostClassService.addHostClass(hostClass);
        return ResponseEntity.ok(newHostClass);
    }

    @GetMapping
    public ResponseEntity<List<HostClass>> getAllHostClasses() {
        List<HostClass> hostClasses = hostClassService.getAllHostClasses();
        return ResponseEntity.ok(hostClasses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<HostClass> getHostClassById(@PathVariable Long id) {
        Optional<HostClass> hostClass = hostClassService.getHostClassById(id);
        return hostClass.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHostClass(@PathVariable Long id) {
        hostClassService.deleteHostClass(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<HostClass>> getHostClassesByTutorId(@PathVariable int tutorId) {
        List<HostClass> hostClasses = hostClassService.getHostClassesByTutorId(tutorId);
        return ResponseEntity.ok(hostClasses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<HostClass> updateHostClass(@PathVariable Long id, @RequestBody HostClass updatedHostClass) {
        Optional<HostClass> existingHostClass = hostClassService.getHostClassById(id);
        if (existingHostClass.isPresent()) {
            HostClass hostClass = existingHostClass.get();
            hostClass.setDescription(updatedHostClass.getDescription());
            hostClass.setClassDate(updatedHostClass.getClassDate());
            HostClass savedHostClass = hostClassService.addHostClass(hostClass);
            return ResponseEntity.ok(savedHostClass);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/tutor/{tutorId}/course/{courseId}/topic/{topicId}")
    public ResponseEntity<HostClass> createHostClassForTutor(@PathVariable int tutorId, @PathVariable int courseId, @PathVariable int topicId, @RequestBody HostClass hostClass) {
        HostClass newHostClass = hostClassService.createHostClassForTutor(tutorId, courseId, topicId, hostClass.getClassDate(), hostClass.getDescription());
        return ResponseEntity.ok(newHostClass);
    }
}