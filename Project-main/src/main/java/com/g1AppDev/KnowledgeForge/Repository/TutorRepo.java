package com.g1AppDev.KnowledgeForge.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.g1AppDev.KnowledgeForge.Entity.Tutor;

public interface TutorRepo extends JpaRepository<Tutor, Integer> {
    Tutor findByEmail(String email);
    Optional<Tutor> findByUsernameAndPassword(String username, String password);
    Optional<Tutor> findByUsername(String username);
    List<Tutor> findByTutorName(String tutorName);
}