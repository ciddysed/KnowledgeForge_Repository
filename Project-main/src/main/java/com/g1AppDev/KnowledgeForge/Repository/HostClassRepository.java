package com.g1AppDev.KnowledgeForge.Repository;

import com.g1AppDev.KnowledgeForge.Entity.HostClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HostClassRepository extends JpaRepository<HostClass, Long> {
    List<HostClass> findByTutor_TutorID(int tutorId);
}