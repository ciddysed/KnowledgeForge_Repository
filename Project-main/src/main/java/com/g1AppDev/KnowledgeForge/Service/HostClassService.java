package com.g1AppDev.KnowledgeForge.Service;

import com.g1AppDev.KnowledgeForge.Entity.HostClass;
import com.g1AppDev.KnowledgeForge.Repository.HostClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.g1AppDev.KnowledgeForge.Entity.Tutor;
import com.g1AppDev.KnowledgeForge.Entity.Course;
import com.g1AppDev.KnowledgeForge.Entity.Topic;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class HostClassService {

    private static final Logger logger = LoggerFactory.getLogger(HostClassService.class);

    @Autowired
    private HostClassRepository hostClassRepository;

    public HostClass addHostClass(HostClass hostClass) {
        logger.info("Adding HostClass: {}", hostClass);
        return hostClassRepository.save(hostClass);
    }

    public List<HostClass> getAllHostClasses() {
        logger.info("Fetching all HostClasses");
        return hostClassRepository.findAll();
    }

    public Optional<HostClass> getHostClassById(Long id) {
        logger.info("Fetching HostClass by ID: {}", id);
        return hostClassRepository.findById(id);
    }

    public void deleteHostClass(Long id) {
        logger.info("Deleting HostClass by ID: {}", id);
        hostClassRepository.deleteById(id);
    }

    public List<HostClass> getHostClassesByTutorId(int tutorId) {
        logger.info("Fetching HostClasses by Tutor ID: {}", tutorId);
        return hostClassRepository.findByTutor_TutorID(tutorId);
    }

    public List<HostClass> getClassesByTutorId(int tutorId) {
        return hostClassRepository.findByTutor_TutorID(tutorId);
    }

    // public HostClass createHostClassForTutor(int hostClassID, int tutorId, int courseId, int topicId) {
    //     HostClass hostClass = new HostClass();
    //     hostClass.setHostClassID(hostClassID); 
    //     hostClass.setTutor(new Tutor(tutorId));
    //     hostClass.setCourse(new Course(courseId));
    //     hostClass.setTopic(new Topic(topicId));
    //     logger.info("Creating HostClass for Tutor ID: {}", tutorId);
    //     return hostClassRepository.save(hostClass);
    // }

    public HostClass createHostClassForTutor(int tutorId, int courseId, int topicId, String classDate, String description) {
        HostClass hostClass = new HostClass();
        hostClass.setTutor(new Tutor(tutorId));
        hostClass.setCourse(new Course(courseId));
        hostClass.setTopic(new Topic(topicId));
        hostClass.setClassDate(classDate);
        hostClass.setDescription(description);
        logger.info("Creating HostClass for Tutor ID: {}", tutorId);
        return hostClassRepository.save(hostClass);
    }
}