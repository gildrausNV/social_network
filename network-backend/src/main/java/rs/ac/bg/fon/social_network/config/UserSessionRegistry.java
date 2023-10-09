package rs.ac.bg.fon.social_network.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.service.UserService;

import java.util.HashSet;
import java.util.Set;
@RequiredArgsConstructor
@Component
@Scope("singleton")
public class UserSessionRegistry {
    private final UserService userService;
    private final Set<User> connectedUsers = new HashSet<>();

    public synchronized void registerUser(Long userId) {
        connectedUsers.add(userService.getById(userId));
    }

    public synchronized void unregisterUser(Long userId) {
        connectedUsers.remove(userService.getById(userId));
    }

    public synchronized Set<User> getConnectedUsers() {
        return new HashSet<>(connectedUsers);
    }
}
