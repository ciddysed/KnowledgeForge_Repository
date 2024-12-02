package com.g1AppDev.KnowledgeForge.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g1AppDev.KnowledgeForge.Entity.Course;
import com.g1AppDev.KnowledgeForge.Entity.Tutor;
import com.g1AppDev.KnowledgeForge.Repository.CourseRepo;
import com.g1AppDev.KnowledgeForge.Repository.TutorRepo;

@Service
public class CourseService {

    @Autowired
    private CourseRepo courseRepository;

    @Autowired
    private TutorRepo tutorRepository;

    public List<Course> getAllCourses() {
        return (List<Course>) courseRepository.findAll();
    }

    public Course saveDetails(Course course) {
        return courseRepository.save(course);
    }

    // Update course
    public Course updateCourse(int id, Course course) {
        Optional<Course> existingCourse = courseRepository.findById(id);
        if (existingCourse.isPresent()) {
            Course updatedCourse = existingCourse.get();
            updatedCourse.setCourseName(course.getCourseName());
            return courseRepository.save(updatedCourse);
        }
        return null;
    }

    // Delete course
    public String deleteCourse(int id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return "Course with ID: " + id + " deleted.";
        }
        return "Course not found!";
    }

    // USER SPECIFIC METHODS
    public List<Course> getCoursesByTutor(String username) {
        System.out.println("Fetching courses for tutor: " + username);
        List<Course> courses = courseRepository.findByTutor_Username(username);
        System.out.println("Courses found: " + courses.size());
        return courses;
    }

    public Course addCourseForTutor(String username, Course course) {
        Tutor tutor = tutorRepository.findByUsername(username);
        if (tutor != null) {
            course.setTutor(tutor);
            return courseRepository.save(course);
        } else {
            throw new IllegalArgumentException("Tutor with username " + username + " not found");
        }
    }
}