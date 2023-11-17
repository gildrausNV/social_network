package rs.ac.bg.fon.social_network.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

        private final AuthenticationService authenticationService;

        @PostMapping("/register")
        public AuthenticationResponse register(@RequestBody RegisterRequest request) {
            return authenticationService.register(request);
        }

        @PostMapping("/login")
        public void login(@RequestBody LoginRequest request) {
            authenticationService.login(request);
        }

        @PostMapping("/verify")
        public AuthenticationResponse verify(@RequestBody VerificationRequest request) {
            return authenticationService.verifyUser(request);
        }
}
