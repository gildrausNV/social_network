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
public class Post {

    @Id
    @GeneratedValue
    private Long id;

    @Column(length = 2047)
    private String content;

    @Column(length = 2047)
    private String topic;

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    @ManyToOne
    @JoinColumn(name = "trend_id")
    private Trend trend;

    private LocalDateTime timePosted;
}
