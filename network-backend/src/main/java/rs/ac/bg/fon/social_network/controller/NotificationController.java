package rs.ac.bg.fon.social_network.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import rs.ac.bg.fon.social_network.domain.Notification;
import rs.ac.bg.fon.social_network.service.NotificationService;

@RestController
@RequestMapping("/api/v1/notifications")
@CrossOrigin
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public Page<Notification> getAll(Pageable pageable) {
        return notificationService.getAll(pageable);
    }

//    @GetMapping
//    public Page<Notification> getAll(@RequestParam Boolean isRead, Pageable pageable) {
//        return notificationService.getAll(isRead, pageable);
//    }

    @GetMapping("/{id}")
    public Notification getById(@PathVariable Long id) {
        return notificationService.getById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteById(@PathVariable Long id) {
        notificationService.deleteById(id);
    }
}
