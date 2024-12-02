package com.g1AppDev.KnowledgeForge.Entity;

public class StudentMessage {
    private String username;
    private String email;

    // Constructors
    public StudentMessage() {}

    public StudentMessage(String username, String email) {
        this.username = username;
        this.email = email;
    }

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}