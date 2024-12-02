package com.g1AppDev.KnowledgeForge.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "module_id")  // Column label for the primary key
    private int moduleID;

    @Column(name = "module_name", nullable = false)  // Non-nullable column
    private String moduleName;

    // Many modules belong to one topic
    @ManyToOne
    @JoinColumn(name = "topic_id", nullable = false)  // Foreign key column
    private Topic topic;

    // Constructors
    public Module() {
    }

    public Module(String moduleName, Topic topic) {
        this.moduleName = moduleName;
        this.topic = topic;
    }

    // Getters and Setters
    public int getModuleID() {
        return moduleID;
    }

    public void setModuleID(int moduleID) {
        this.moduleID = moduleID;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }
}