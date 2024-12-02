package com.g1AppDev.KnowledgeForge.Repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.g1AppDev.KnowledgeForge.Entity.Topic;


@Repository
public interface TopicRepo extends JpaRepository<Topic, Integer> {
    // You can add custom query methods if needed
    List<Topic> findByCourse_CourseID(int courseID);
}
