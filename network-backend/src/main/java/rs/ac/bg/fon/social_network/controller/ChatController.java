package rs.ac.bg.fon.social_network.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import rs.ac.bg.fon.social_network.config.UserSessionRegistry;
import rs.ac.bg.fon.social_network.domain.Message;
import rs.ac.bg.fon.social_network.domain.Status;

@Controller
@RequiredArgsConstructor
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    private UserSessionRegistry userSessionRegistry; // Autowire UserSessionRegistry

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println("Connected: " + message);
        userSessionRegistry.registerUser(message.getSenderId()); // Register user
        sendUserListUpdate(); // Send user list update when a new user connects
        return message;
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message) {
        Long receiverId = message.getReceiverId();
        System.out.println("Sending message to user with ID: " + receiverId);
        simpMessagingTemplate.convertAndSendToUser(receiverId.toString(), "/private", message);
        System.out.println(message.toString());
        return message;
    }

    @MessageMapping("/update-connected-users") // New mapping for updating connected users
    public void updateConnectedUsers() {
        sendUserListUpdate();
    }

    private void sendUserListUpdate() {
        Message message = new Message();
        message.setConnectedUsers(userSessionRegistry.getConnectedUsers()); // Get connected users from the registry
        message.setMessage("User list updated");
        message.setStatus(Status.JOIN);
        System.out.println(message);
        System.out.println(userSessionRegistry.getConnectedUsers());
        simpMessagingTemplate.convertAndSend("/chatroom/user-list", message); // Send to a specific destination for user list updates
    }

    @MessageMapping("/disconnect")
    public void handleDisconnect(@Payload Message message) {
        Long userId = message.getSenderId();
        userSessionRegistry.unregisterUser(userId); // Remove the user from the list of connected users
        System.out.println(userSessionRegistry.getConnectedUsers());
        sendUserListUpdate(); // Broadcast user list update to other users
    }

}
