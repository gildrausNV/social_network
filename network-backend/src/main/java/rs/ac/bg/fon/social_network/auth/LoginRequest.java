package rs.ac.bg.fon.social_network.auth;

import lombok.*;


@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class LoginRequest {
  private String username;
  private String password;
}
