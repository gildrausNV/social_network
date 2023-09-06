package rs.ac.bg.fon.social_network.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.Action;
import rs.ac.bg.fon.social_network.domain.Notification;
import rs.ac.bg.fon.social_network.domain.Role;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.repository.NotificationRepository;
import rs.ac.bg.fon.social_network.repository.UserRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ActionService actionService;
    private final NotificationRepository notificationRepository;

    public List<User> getAll() {
        return userRepository.findAll()
                        .stream()
                        .filter(user -> user.getRole().equals(Role.USER))
                        .filter(user -> !user.equals(getCurrentlyLoggedInUser()))
                        .toList();
    }

    public User getCurrentlyLoggedInUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public User getById(Long id) {
        return userRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public void followAnotherUser(Long followingUserId) {
        User currentlyLoggedInUser = getCurrentlyLoggedInUser();
        User followingUser = getById(followingUserId);
        currentlyLoggedInUser.getFollowing().add(followingUser);
        followingUser.getFollowers().add(currentlyLoggedInUser);
        userRepository.save(currentlyLoggedInUser);
        userRepository.save(followingUser);

        actionService.createAction(getCurrentlyLoggedInUser());

        Notification notification = Notification.builder()
                .content(currentlyLoggedInUser.getUsername() + " has followed " + followingUser.getUsername())
                .subscriber(followingUser)
                .publisher(currentlyLoggedInUser)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();
        notificationRepository.save(notification);

    }

    public void unfollow(Long userIdToUnfollow) {
        User currentlyLoggedInUser = getCurrentlyLoggedInUser();
        User userToUnfollow = getById(userIdToUnfollow);
        currentlyLoggedInUser.getFollowing().remove(userToUnfollow);
        userToUnfollow.getFollowers().remove(currentlyLoggedInUser);
        userRepository.save(currentlyLoggedInUser);
        userRepository.save(userToUnfollow);

        actionService.createAction(getCurrentlyLoggedInUser());

        Notification notification = Notification.builder()
                .content(currentlyLoggedInUser.getUsername() + " has unfollowed " + userToUnfollow.getUsername())
                .subscriber(userToUnfollow)
                .publisher(currentlyLoggedInUser)
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build();

        notificationRepository.save(notification);
    }

    public List<User> getFollowers() {
        User currentlyLoggedInUser = getCurrentlyLoggedInUser();
        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN)) {
            throw new IllegalStateException("You cannot have followers while being authenticated as admin");
        }
        return currentlyLoggedInUser.getFollowers().stream().toList();
    }

    public List<User> getFollowing() {
        User currentlyLoggedInUser = getCurrentlyLoggedInUser();
        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN)) {
            throw new IllegalStateException("You cannot have followers while being authenticated as admin");
        }
        return currentlyLoggedInUser.getFollowing().stream().toList();
    }

    public List<User> findByUsername(String username) {
        return userRepository.findByUsernameContainsIgnoreCase(username);
    }

    public boolean isFollowing(Long userId) {
        User currentlyLoggedInUser = getCurrentlyLoggedInUser();
        return currentlyLoggedInUser.getFollowing().contains(getById(userId));
    }

    public Map<LocalDate, List<Action>> getActionsByUser(Long userId) {
        return actionService.getActionsByUser(userId);
    }
}
