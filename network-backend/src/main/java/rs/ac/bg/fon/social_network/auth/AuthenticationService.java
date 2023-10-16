package rs.ac.bg.fon.social_network.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.config.JwtService;
import rs.ac.bg.fon.social_network.domain.Role;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.repository.UserRepository;

import javax.mail.MessagingException;
import javax.naming.AuthenticationException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    private final EmailService emailService;
    private final Map<String, String> verificationCodes = new HashMap<>();

    public void addVerificationCode(String username, String verificationCode) {
        verificationCodes.put(username, verificationCode);
    }

    public String getVerificationCode(String username) {
        return verificationCodes.get(username);
    }

    public void removeVerificationCode(String username) {
        verificationCodes.remove(username);
    }

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .gender(request.getGender())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();
        userRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        return new AuthenticationResponse(jwtToken, Role.USER, user.getId());
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new AuthenticationResponse("Incorrect username or password", null, 0)).getBody();
        }

        String verificationCode = generateRandomVerificationCode();
        addVerificationCode(user.getUsername(), verificationCode);
        try {
            sendVerificationCodeEmail(user.getEmail(), verificationCode, user);
        } catch (MessagingException e) {
            System.out.println("ERROR");
        }

        return new AuthenticationResponse("Verification code sent to your email", null, 0);
    }


    private String generateRandomVerificationCode() {
        int codeLength = 6;
        String characters = "0123456789";
        StringBuilder code = new StringBuilder();

        Random random = new Random();
        for (int i = 0; i < codeLength; i++) {
            int index = random.nextInt(characters.length());
            code.append(characters.charAt(index));
        }
        return code.toString();
    }

    private void sendVerificationCodeEmail(String recipientEmail, String verificationCode, User user) throws MessagingException {
        System.out.println(verificationCode);
        user.setVerificationCode(verificationCode);
        emailService.sendEmail(recipientEmail, verificationCode, user.getUsername(), user.getPassword());
    }

    public AuthenticationResponse verifyUser(VerificationRequest request) throws AuthenticationException {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null) {
            return new AuthenticationResponse("Incorrect code", null, 0);
        }

        String storedVerificationCode = getVerificationCode(user.getUsername());

        if (storedVerificationCode != null && storedVerificationCode.equals(request.getVerificationCode())) {
            user.setVerified(true);
            userRepository.save(user);
            removeVerificationCode(user.getUsername());
            String jwtToken = jwtService.generateToken(user);
            return new AuthenticationResponse(jwtToken, user.getRole(), user.getId());
        } else {
            throw new AuthenticationException("Incorrect code");
        }
    }

}
