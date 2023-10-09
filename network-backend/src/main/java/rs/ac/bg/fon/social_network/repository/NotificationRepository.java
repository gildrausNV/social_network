package rs.ac.bg.fon.social_network.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rs.ac.bg.fon.social_network.domain.Notification;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Query("select n from Notification n where n.id = ?1")
    Notification findNotificationById(Long id);
    @Query("select n from Notification n where n.subscriber.id = ?1 and n.isRead = ?2")
    List<Notification> findBySubscriber_IdAndIsRead(Long id, Boolean isRead);
    Page<Notification> findBySubscriberIdAndIsRead(Long subscirberId, Boolean isRead, Pageable pageable);
    Page<Notification> findByIsRead(Boolean isRead, Pageable pageable);
    Page<Notification> findBySubscriberId(Long subscriberId, Pageable pageable);
}