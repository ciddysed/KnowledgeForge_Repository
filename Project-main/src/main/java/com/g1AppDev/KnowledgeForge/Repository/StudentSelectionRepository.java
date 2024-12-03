package com.g1AppDev.KnowledgeForge.Repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g1AppDev.KnowledgeForge.Entity.StudentSelection;

@Repository
public interface StudentSelectionRepository extends JpaRepository<StudentSelection, Long> {

    List<StudentSelection> findByTutorUsername(String tutorUsername);

    List<StudentSelection> findTutorsByStudentUsername(String studentUsername);

    void deleteByTutorId(Long tutorId);

}
