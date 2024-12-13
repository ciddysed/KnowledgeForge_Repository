package com.g1AppDev.KnowledgeForge.Repository;

import com.g1AppDev.KnowledgeForge.Entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Integer> {
    
    List<Module> findByTopic_TopicID(int topicId);
}