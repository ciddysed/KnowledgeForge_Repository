package com.g1AppDev.KnowledgeForge.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.g1AppDev.KnowledgeForge.Entity.Course;
import com.g1AppDev.KnowledgeForge.Service.CourseService;

@RestController
@RequestMapping("/Course")
public class CourseController {
    
    @Autowired
    private CourseService courseService;

    @GetMapping("/getCourse")
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    @PostMapping("/addCourses") 
    public Course createCourse(@RequestBody Course course) {
        return courseService.saveDetails(course);
    }

    // Update course
    @PutMapping("/updateCourse/{id}")
    public Course updateCourse(@PathVariable int id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    // Delete course
    @DeleteMapping("/deleteCourse/{id}")
    public String deleteCourse(@PathVariable int id) {
        return courseService.deleteCourse(id);
    }

    // User SPECIFIC
    @GetMapping("/tutors/{username}/courses")
    public List<Course> getCoursesByTutor(@PathVariable String username) {
        return courseService.getCoursesByTutor(username);
    }

    @PostMapping("/tutors/{username}/courses")
    public Course createCourse(@PathVariable String username, @RequestBody Course course) {
        return courseService.addCourseForTutor(username, course);
    }

    @PutMapping("/tutors/{username}/courses/{id}")
    public Course updateCourse(@PathVariable String username, @PathVariable int id, @RequestBody Course course) {
        return courseService.updateCourse(id, course);
    }

    @DeleteMapping("/tutors/{username}/courses/{id}")
    public String deleteCourse(@PathVariable String username, @PathVariable int id) {
        return courseService.deleteCourse(id);
    }
}