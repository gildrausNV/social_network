package rs.ac.bg.fon.social_network.auth;

import lombok.*;
import rs.ac.bg.fon.social_network.domain.Role;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class AuthenticationResponse {

  private String token;
  private Role role;
}
