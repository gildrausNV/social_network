package rs.ac.bg.fon.social_network.seed;

import com.github.javafaker.Faker;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.Gender;
import rs.ac.bg.fon.social_network.domain.Role;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.repository.UserRepository;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FakeService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Faker faker = new Faker();
    public void seedUsers() {
        User user1 = getFakeUser();
        User user2 = getFakeUser();
        User user3 = getFakeUser();
        User user4 = getFakeUser();

        user1.setFollowers(new HashSet<>(List.of(user2, user3)));
        user1.setFollowing(new HashSet<>(List.of(user2)));

        user2.setFollowers(new HashSet<>(List.of(user1)));
        user2.setFollowing(new HashSet<>(List.of(user1, user4)));

        user3.setFollowers(new HashSet<>(List.of(user4)));
        user3.setFollowing(new HashSet<>(List.of(user1, user4)));

        user4.setFollowers(new HashSet<>(List.of(user3, user2)));
        user4.setFollowing(new HashSet<>(List.of(user3)));

        userRepository.save(user1);
        userRepository.save(user2);
        userRepository.save(user3);
        userRepository.save(user4);
    }

    public void seedAdmin() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin"));
        admin.setEmail("admin@example.com");
        admin.setFirstname("admin");
        admin.setLastname("admin");
        admin.setGender(Gender.MALE);
        admin.setRole(Role.ADMIN);

        userRepository.save(admin);
    }

    private User getFakeUser() {
        User user = new User();
        user.setEmail(faker.internet().emailAddress());
        user.setUsername(faker.name().username());
        user.setPassword(passwordEncoder.encode(faker.internet().password()));
        user.setFirstname(faker.name().firstName());
        user.setLastname(faker.name().lastName());
        user.setGender(Gender.MALE);
        user.setRole(Role.USER);

        return user;
    }
}
