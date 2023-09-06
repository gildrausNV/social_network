package rs.ac.bg.fon.social_network.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rs.ac.bg.fon.social_network.domain.Notification;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findBySubscriberIdAndIsRead(Long subscirberId, Boolean isRead, Pageable pageable);
    Page<Notification> findByIsRead(Boolean isRead, Pageable pageable);
    Page<Notification> findBySubscriberId(Long subscriberId, Pageable pageable);
}