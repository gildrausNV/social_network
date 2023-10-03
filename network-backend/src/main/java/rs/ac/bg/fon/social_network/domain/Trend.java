package rs.ac.bg.fon.social_network.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Trend {
    @Id
    @GeneratedValue
    private Long id;
    private String topic;

    private int numberOfPosts;


}
