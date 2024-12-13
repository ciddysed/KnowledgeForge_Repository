package com.g1AppDev.KnowledgeForge.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.g1AppDev.KnowledgeForge.Entity.StudentSelection;

@Controller
public class WebSocketController {

    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public WebSocketController(SimpMessagingTemplate simpMessagingTemplate) {
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    // Notify a specific tutor
    @MessageMapping("/notifyTutor/{tutorUsername}")
    @SendTo("/topic/notification/tutor/{tutorUsername}")
    public StudentSelection notifyTutor(@DestinationVariable String tutorUsername, StudentSelection studentSelection) {
        System.out.println("Notifying tutor: " + tutorUsername);
        System.out.println("Student selection: " + studentSelection);
        return studentSelection; // This is sent to subscribed clients
    }

    // Optionally, notify a specific student (similar to the above)
    @MessageMapping("/notifyStudent/{studentUsername}")
    @SendTo("/notification/{studentUsername}")
    public String notifySpecificStudent(@DestinationVariable String studentUsername, String message) {
        // You can modify the message further if needed
        return "Message from tutor to " + studentUsername + ": " + message;
    }

    // Notify a specific student about tutor acceptance
    @MessageMapping("/acceptance/{studentUsername}")
    @SendTo("/topic/acceptance/{studentUsername}")
    public String notifyStudentAcceptance(@DestinationVariable String studentUsername, String message) {
        return message;
    }
    
}
