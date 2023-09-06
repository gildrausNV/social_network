package rs.ac.bg.fon.social_network.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.Notification;
import rs.ac.bg.fon.social_network.domain.Role;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.repository.NotificationRepository;

import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    public Page<Notification> getAll(Pageable pageable) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN))
            return notificationRepository.findAll(pageable);
        return notificationRepository.findBySubscriberId(currentlyLoggedInUser.getId(), pageable);
    }

    public Page<Notification> getAll(Boolean isRead, Pageable pageable) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN))
            return notificationRepository.findByIsRead(isRead, pageable);
        return notificationRepository.findBySubscriberIdAndIsRead(currentlyLoggedInUser.getId(), isRead, pageable);
    }

    public Notification getById(Long id) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        Notification notification = notificationRepository.findById(id).orElseThrow(NoSuchElementException::new);
        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN))
            throw new AccessDeniedException("Admin cannot access notifications");
        if (!currentlyLoggedInUser.equals(notification.getSubscriber())) {
            throw new AccessDeniedException("User cannot access different users notifications.");
        }
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public void deleteById(Long id) {
        Notification notification = getById(id);
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        if(!notification.getSubscriber().equals(currentlyLoggedInUser))
            throw new AccessDeniedException("User cannot access different users notifications.");
        notificationRepository.delete(notification);
    }

}
