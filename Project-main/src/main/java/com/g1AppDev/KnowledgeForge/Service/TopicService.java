package com.g1AppDev.KnowledgeForge.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.g1AppDev.KnowledgeForge.Entity.Course;
import com.g1AppDev.KnowledgeForge.Entity.Topic;
import com.g1AppDev.KnowledgeForge.Repository.CourseRepo;
import com.g1AppDev.KnowledgeForge.Repository.TopicRepo;

@Service
public class TopicService {

    

    @Autowired
    private final TopicRepo topicRepository;

    @Autowired
    private CourseRepo courseRepository;

    @Autowired
    public TopicService(TopicRepo topicRepository) {
        this.topicRepository = topicRepository;
    }

    // Create
    public Topic createTopic(Topic topic) {
        return topicRepository.save(topic);
    }

    // Find by ID
    public Optional<Topic> findTopicById(int id) {
        return topicRepository.findById(id);
    }

    // Find All
    public List<Topic> findAllTopics() {
        return topicRepository.findAll();
    }

    // Update
    public Topic updateTopic(int id, Topic updatedTopic) {
        Optional<Topic> existingTopic = topicRepository.findById(id);
        if (existingTopic.isPresent()) {
            Topic topic = existingTopic.get();
            topic.setTopicName(updatedTopic.getTopicName());
            topic.setDescription(updatedTopic.getDescription());
            return topicRepository.save(topic);
        }
        return null;
    }

    // Delete
    public boolean deleteTopic(int id) {
        if (topicRepository.existsById(id)) {
            topicRepository.deleteById(id);
            return true;
        }
        return false;
    }

    //USER SPECIFIC FUNCTIONS
    public List<Topic> getTopicsByCourse(int courseID) {
        return topicRepository.findByCourse_CourseID(courseID);
    }

    public Topic addTopicToCourse(int courseID, Topic topic) {
        Course course = courseRepository.findById(courseID).orElseThrow(() -> new IllegalArgumentException("Course with ID " + courseID + " not found"));
        topic.setCourse(course);
        return topicRepository.save(topic);
    }

    public Topic updateTopicForCourse(int courseID, int topicID, Topic topic) {
        Topic existingTopic = topicRepository.findById(topicID).orElseThrow(() -> new IllegalArgumentException("Topic with ID " + topicID + " not found"));
        if (existingTopic.getCourse().getCourseID() != courseID) {
            throw new IllegalArgumentException("Topic does not belong to the specified course");
        }
        existingTopic.setTopicName(topic.getTopicName());
        return topicRepository.save(existingTopic);
    }

    public boolean deleteTopicForCourse(int courseID, int topicID) {
        Topic existingTopic = topicRepository.findById(topicID).orElseThrow(() -> new IllegalArgumentException("Topic with ID " + topicID + " not found"));
        if (existingTopic.getCourse().getCourseID() != courseID) {
            throw new IllegalArgumentException("Topic does not belong to the specified course");
        }
        topicRepository.deleteById(topicID);
        return true;
    }
}