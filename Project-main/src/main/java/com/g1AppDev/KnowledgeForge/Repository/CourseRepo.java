package com.g1AppDev.KnowledgeForge.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g1AppDev.KnowledgeForge.Entity.Course;

@Repository
public interface CourseRepo extends JpaRepository<Course, Integer> {
    List<Course> findByTutor_Username(String username);
}