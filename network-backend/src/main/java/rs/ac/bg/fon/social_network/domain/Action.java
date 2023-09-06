package rs.ac.bg.fon.social_network.domain;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class Action {

    @Id
    @GeneratedValue
    private Long id;

    private LocalDate timestamp;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
