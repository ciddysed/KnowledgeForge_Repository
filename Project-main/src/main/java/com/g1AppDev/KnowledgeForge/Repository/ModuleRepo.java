package com.g1AppDev.KnowledgeForge.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.g1AppDev.KnowledgeForge.Entity.Module;


@Repository
public interface ModuleRepo extends JpaRepository<Module, Integer> {
    // You can add custom query methods if needed
    List<Module> findByTopic_TopicID(int topicId);
}
