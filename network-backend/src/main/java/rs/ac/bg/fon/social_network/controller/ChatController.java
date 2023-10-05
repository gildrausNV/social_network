package rs.ac.bg.fon.social_network.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import rs.ac.bg.fon.social_network.domain.Message;

import java.util.ArrayList;
import java.util.List;

@Controller
public class ChatController {
    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;

    List<String> connectedUsers = new ArrayList<>();

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public Message receiveMessage(@Payload Message message) {
        System.out.println("Connected" + message.getSenderName());
        if(!connectedUsers.contains(message.getSenderName())) connectedUsers.add(message.getSenderName());
        message.setMessage(connectedUsers.toString());
        System.out.println(connectedUsers.toString());
        simpMessagingTemplate.convertAndSend(message);
        return message;
    }

    @MessageMapping("/private-message")
    public Message recMessage(@Payload Message message){
//        System.out.println("test: " + message.toString());
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private", message);
        System.out.println(message.toString());
        return message;
    }
}
