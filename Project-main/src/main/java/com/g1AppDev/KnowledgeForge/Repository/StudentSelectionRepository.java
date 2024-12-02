
package com.g1AppDev.KnowledgeForge.Repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g1AppDev.KnowledgeForge.Entity.StudentSelection;



public interface StudentSelectionRepository extends JpaRepository<StudentSelection, Long> {

    List<StudentSelection> findByTutorUsername(String tutorUsername);

}
