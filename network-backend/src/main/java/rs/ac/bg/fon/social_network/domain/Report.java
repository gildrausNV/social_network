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
public class Report {

    @Id
    @GeneratedValue
    private Long id;

    private LocalDateTime timestamp;

    @ManyToOne
    @JoinColumn(name = "reported_post_id")
    private Post reportedPost;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter;

}
