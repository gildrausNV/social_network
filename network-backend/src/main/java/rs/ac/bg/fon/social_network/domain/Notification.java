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
@EqualsAndHashCode(exclude = {"publisher", "subscriber"})
@ToString
public class Notification {

    @Id
    @GeneratedValue
    private Long id;

    private String content;

    @ManyToOne
    @JoinColumn(name = "publisher_id")
    private User publisher;

    @ManyToOne
    @JoinColumn(name = "subscriber_id")
    private User subscriber;

    private LocalDateTime timestamp;

    private Boolean isRead;

}
