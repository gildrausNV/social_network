package rs.ac.bg.fon.social_network.auth;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@EqualsAndHashCode
@ToString
public class VerificationRequest {
    private String username;
    private String verificationCode;

}

