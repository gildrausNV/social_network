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

    @ManyToOne
    @JoinColumn(name = "creator_id")
    private User creator;

    private LocalDateTime timePosted;
}
