package rs.ac.bg.fon.social_network.auth;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.config.JwtService;
import rs.ac.bg.fon.social_network.domain.Role;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.repository.UserRepository;

import javax.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Random;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;
    private final Map<User, String> verificationCodes = new HashMap<>();

    public void addVerificationCode(User user, String verificationCode) {
        verificationCodes.put(user, verificationCode);
    }

    public String getVerificationCode(User user) {
        return verificationCodes.get(user);
    }

    public void removeVerificationCode(User user) {
        verificationCodes.remove(user);
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

    public void login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(() -> new UsernameNotFoundException("Username not found"));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Bad credentials");
        }

        String verificationCode = generateRandomVerificationCode();
        addVerificationCode(user, verificationCode);
        try {
            sendVerificationCodeEmail(user.getEmail(), verificationCode, user);
        } catch (MessagingException e) {
            throw new BadCredentialsException(e.getMessage());
        }

    }


    private String generateRandomVerificationCode() {
        String characters = "0123456789";
        StringBuilder code = new StringBuilder();

        Random random = new Random();
        IntStream.range(0,6).forEach(i -> {
            int index = random.nextInt(characters.length());
            code.append(characters.charAt(index));
        });

        return code.toString();
    }

    private void sendVerificationCodeEmail(String recipientEmail, String verificationCode, User user) throws MessagingException {
        emailService.sendEmail(recipientEmail, verificationCode, user.getUsername());
    }

    public AuthenticationResponse verifyUser(VerificationRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElseThrow(NoSuchElementException::new);
        String storedVerificationCode = getVerificationCode(user);

        if (storedVerificationCode != null && storedVerificationCode.equals(request.getVerificationCode())) {
            userRepository.save(user);
            removeVerificationCode(user);
            String jwtToken = jwtService.generateToken(user);
            return new AuthenticationResponse(jwtToken, user.getRole(), user.getId());
        } else {
            throw new BadCredentialsException("Bad verification code");
        }
    }

}
