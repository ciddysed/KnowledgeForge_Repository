package com.g1AppDev.KnowledgeForge.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.g1AppDev.KnowledgeForge.Entity.Class;
import com.g1AppDev.KnowledgeForge.Service.ClassService;
import com.g1AppDev.KnowledgeForge.Service.TutorService;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService classService;

    @Autowired
    private TutorService tutorService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(@PathVariable int id) {
        classService.deleteClass(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<Class>> getClassesByTutor(@PathVariable int tutorId) {
        List<Class> classes = classService.getClassesByTutor(tutorId);
        return ResponseEntity.ok(classes);
    }

    @PostMapping("/tutor/{tutorId}")
    public ResponseEntity<Class> hostClassForTutor(@PathVariable int tutorId, @RequestBody Class newClass) {
        return tutorService.getTutorById(tutorId)
                .map(tutor -> {
                    newClass.setTutor(tutor); // Set the Tutor object
                    Class hostedClass = classService.saveClass(newClass); // Save the new class with tutorId
                    return ResponseEntity.ok(hostedClass);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}