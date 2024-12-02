package com.g1AppDev.KnowledgeForge.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g1AppDev.KnowledgeForge.Entity.Quiz;


@Repository
public interface QuizRepo extends JpaRepository<Quiz, Integer> {
    // You can add custom query methods if needed
}
