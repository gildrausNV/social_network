package rs.ac.bg.fon.social_network.auth;

import lombok.*;
import rs.ac.bg.fon.social_network.domain.Gender;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class RegisterRequest {
  private String firstname;
  private String lastname;
  private String email;
  private Gender gender;
  private String username;
  private String password;
}
