package com.g1AppDev.KnowledgeForge.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.g1AppDev.KnowledgeForge.Entity.Chat;

@Controller
public class ChatController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @MessageMapping("/private-message")
    public void sendPrivateMessage(@Payload Chat chat, SimpMessageHeaderAccessor headerAccessor) {
        // Send the private message to the intended receiver
        simpMessagingTemplate.convertAndSendToUser(
                chat.getReceiverName(),  // Receiver's username
                "/private",                // Destination
                chat                    // The message payload
        );

        // Send a notification to the receiver about the new message
        simpMessagingTemplate.convertAndSendToUser(
                chat.getReceiverName(),  // Receiver's username
                "/notification",           // Notification destination
                "New message from " + chat.getSenderName()
        );

        System.out.println("Message sent: " + chat.toString());
    }
}       


