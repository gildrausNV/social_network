package rs.ac.bg.fon.social_network.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import rs.ac.bg.fon.social_network.config.UserSessionRegistry;
import rs.ac.bg.fon.social_network.domain.FollowNotification;
import rs.ac.bg.fon.social_network.domain.Message;
import rs.ac.bg.fon.social_network.domain.NotificationType;
import rs.ac.bg.fon.social_network.domain.Status;

@Controller
@RequiredArgsConstructor
public class ChatController {
    private final SimpMessagingTemplate simpMessagingTemplate;

    private final UserSessionRegistry userSessionRegistry;

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println("Connected: " + message);
        userSessionRegistry.registerUser(message.getSenderId());
        sendUserListUpdate();
        return message;
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message) {
        Long receiverId = message.getReceiverId();
        System.out.println("Sending message to user with ID: " + receiverId);
        simpMessagingTemplate.convertAndSendToUser(receiverId.toString(), "/private", message);
        System.out.println(message);
        FollowNotification followNotification = new FollowNotification();
        followNotification.setType(NotificationType.CHAT_MESSAGE);
        followNotification.setMessage("Someone sent a message!");
        simpMessagingTemplate.convertAndSendToUser(
                receiverId.toString(),
                "/follow-notification",
                followNotification
        );
        return message;
    }

    @MessageMapping("/update-connected-users")
    public void updateConnectedUsers() {
        sendUserListUpdate();
    }

    private void sendUserListUpdate() {
        Message message = new Message();
        message.setConnectedUsers(userSessionRegistry.getConnectedUsers());
        message.setMessage("User list updated");
        message.setStatus(Status.JOIN);
        System.out.println(message);
        System.out.println(userSessionRegistry.getConnectedUsers());
        simpMessagingTemplate.convertAndSend("/chatroom/user-list", message);
    }

    @MessageMapping("/disconnect")
    public void handleDisconnect(@Payload Message message) {
        Long userId = message.getSenderId();
        userSessionRegistry.unregisterUser(userId);
        System.out.println(userSessionRegistry.getConnectedUsers());
        sendUserListUpdate();
    }



}
