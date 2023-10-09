package rs.ac.bg.fon.social_network.domain;

import lombok.*;

import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class Message {
    private long senderId;
    private long receiverId;
    private String message;
    private Set<User> connectedUsers;
    private Status status;
}
