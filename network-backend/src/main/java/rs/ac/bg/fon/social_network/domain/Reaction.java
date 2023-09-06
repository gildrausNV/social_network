package rs.ac.bg.fon.social_network.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Reaction {

    @Id
    @GeneratedValue
    private Long id;

    @Enumerated(EnumType.STRING)
    private ReactionType reactionType;

    @ManyToOne
    @JoinColumn(name = "liked_by_user_id")
    private User likedByUser;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post;
}
