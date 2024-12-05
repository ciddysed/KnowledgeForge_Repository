package com.g1AppDev.KnowledgeForge.Repository;



import com.g1AppDev.KnowledgeForge.Entity.Class;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<Class, Integer> {
    // Custom query methods if needed
    List<Class> findByTutorTutorID(int tutorId);
}

