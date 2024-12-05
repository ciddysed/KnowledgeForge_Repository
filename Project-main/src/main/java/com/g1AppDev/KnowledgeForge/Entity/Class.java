package com.g1AppDev.KnowledgeForge.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "classes")
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int classID;

    @ManyToOne(fetch = FetchType.EAGER) // Ensure related Tutor is eagerly loaded
    @JoinColumn(name = "tutor_id", nullable = false)
    private Tutor tutor;

    @ManyToOne(fetch = FetchType.EAGER) // Ensure related Student is eagerly loaded
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne(fetch = FetchType.EAGER) // Ensure related Course is eagerly loaded
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER) // Ensure related Topic is eagerly loaded
    @JoinColumn(name = "topic_id", nullable = false)
    private Topic topic;

    @Column(name = "class_date", nullable = false)
    private LocalDateTime classDate;

    @Column(name = "description")
    private String description;

    // Getters and setters
    public int getClassID() {
        return classID;
    }

    public void setClassID(int classID) {
        this.classID = classID;
    }

    public Tutor getTutor() {
        return tutor;
    }

    public void setTutor(Tutor tutor) {
        this.tutor = tutor;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public LocalDateTime getClassDate() {
        return classDate;
    }

    public void setClassDate(LocalDateTime classDate) {
        this.classDate = classDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
