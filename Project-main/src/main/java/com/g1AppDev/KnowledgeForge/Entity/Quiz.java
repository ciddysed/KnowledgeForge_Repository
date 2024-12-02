package com.g1AppDev.KnowledgeForge.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")  // Column label for the primary key
    private int quizID;

    @Column(name = "title", nullable = false)  // Non-nullable column for the quiz title
    private String title;

    // Many quizzes belong to one topic
    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)  // Foreign key column
    private Topic topic;

    // Constructors
    public Quiz() {
    }

    public Quiz(String title, Topic topic) {
        this.title = title;
        this.topic = topic;
    }

    // Getters and Setters
    public int getQuizID() {
        return quizID;
    }

    public void setQuizID(int quizID) {
        this.quizID = quizID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }
}