package com.g1AppDev.KnowledgeForge.Controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.g1AppDev.KnowledgeForge.Entity.Topic;
import com.g1AppDev.KnowledgeForge.Service.TopicService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/topics")
public class TopicController {

    

    @Autowired
    private final TopicService topicService;
    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    // Create Topic
    @PostMapping("/addTopic")
    public ResponseEntity<Topic> createTopic(@RequestBody Topic topic) {
        Topic createdTopic = topicService.createTopic(topic);
        return new ResponseEntity<>(createdTopic, HttpStatus.CREATED);
    }

    // Get Topic by ID
    @GetMapping("/{id}")
    public ResponseEntity<Topic> getTopicById(@PathVariable int id) {
        Optional<Topic> topic = topicService.findTopicById(id);
        return topic.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get All Topics
    @GetMapping
    public ResponseEntity<List<Topic>> getAllTopics() {
        List<Topic> topics = topicService.findAllTopics();
        return ResponseEntity.ok(topics);
    }

    // Update Topic
    @PutMapping("/{id}")
    public ResponseEntity<Topic> updateTopic(@PathVariable int id, @RequestBody Topic updatedTopic) {
        Topic topic = topicService.updateTopic(id, updatedTopic);
        if (topic != null) {
            return ResponseEntity.ok(topic);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Delete Topic
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTopic(@PathVariable int id) {
        if (topicService.deleteTopic(id)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    // Get Topics by Course
    @GetMapping("/tutors/{username}/courses/{courseID}/topics")
    public ResponseEntity<List<Topic>> getTopicsByCourse(@PathVariable String username, @PathVariable int courseID) {
        List<Topic> topics = topicService.getTopicsByCourse(courseID);
        return ResponseEntity.ok(topics);
    }

    // Add Topic to Course
    @PostMapping("/tutors/{username}/courses/{courseID}/topics")
    public ResponseEntity<Topic> addTopicToCourse(@PathVariable String username, @PathVariable int courseID, @RequestBody Topic topic) {
        Topic createdTopic = topicService.addTopicToCourse(courseID, topic);
        return new ResponseEntity<>(createdTopic, HttpStatus.CREATED);
    }

    @PutMapping("/tutors/{username}/courses/{courseID}/topics/{topicID}")
    public ResponseEntity<Topic> updateTopicForCourse(@PathVariable String username, @PathVariable int courseID, @PathVariable int topicID, @RequestBody Topic topic) {
        Topic updatedTopic = topicService.updateTopicForCourse(courseID, topicID, topic);
        return new ResponseEntity<>(updatedTopic, HttpStatus.OK);
    }

    // Delete Topic for Course
    @DeleteMapping("/tutors/{username}/courses/{courseID}/topics/{topicID}")
    public ResponseEntity<Void> deleteTopicForCourse(@PathVariable String username, @PathVariable int courseID, @PathVariable int topicID) {
        if (topicService.deleteTopicForCourse(courseID, topicID)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
