package rs.ac.bg.fon.social_network.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import rs.ac.bg.fon.social_network.domain.Action;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.service.UserService;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @GetMapping
    public Page<User> getAll(Pageable pageable) {
        return userService.getAll(pageable);
    }

    @GetMapping("/currentlyLoggedIn")
    public User getCurrentlyLoggedInUser() {
        return userService.getCurrentlyLoggedInUser();
    }

    @GetMapping("/{id}")
    public User getById(@PathVariable Long id) {
        return userService.getById(id);
    }

    @GetMapping("/username/{username}")
    public List<User> findByUsername(@PathVariable String username) {
        return userService.findByUsername(username);
    }

    @GetMapping("/followers")
    public List<User> getFollowers() {
        return userService.getFollowers();
    }

    @GetMapping("/following")
    public List<User> getFollowing() {
        return userService.getFollowing();
    }

    @PostMapping("/follow/{followingUserId}")
    public void followAnotherUser(@PathVariable Long followingUserId) {
        userService.followAnotherUser(followingUserId);
        Long userIdToFollow = followingUserId;
        simpMessagingTemplate.convertAndSendToUser(
                userIdToFollow.toString(),
                "/follow-notification",
                "You have a new follower!"
        );
    }

    @DeleteMapping("/unfollow/{userIdToUnfollow}")
    public void unfollowAnotherUser(@PathVariable Long userIdToUnfollow) {
        userService.unfollow(userIdToUnfollow);
        simpMessagingTemplate.convertAndSendToUser(
                userIdToUnfollow.toString(),
                "/follow-notification",
                "Someone unfollowed you!"
        );
    }

    @GetMapping("/isFollowing/{userId}")
    public boolean isFollowing(@PathVariable Long userId) {
        return userService.isFollowing(userId);
    }

    @GetMapping("/{userId}/actions")
    public Map<LocalDate, List<Action>> getActionsByUser(@PathVariable Long userId) {
        return userService.getActionsByUser(userId);
    }

}
