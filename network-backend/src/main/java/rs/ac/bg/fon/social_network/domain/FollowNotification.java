package rs.ac.bg.fon.social_network.domain;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class FollowNotification {
    private Long followerId;
    private Long followingId;
    private String message;
}
