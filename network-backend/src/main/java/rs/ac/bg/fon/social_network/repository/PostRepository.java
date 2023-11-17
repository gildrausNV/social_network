package rs.ac.bg.fon.social_network.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rs.ac.bg.fon.social_network.domain.Post;
import rs.ac.bg.fon.social_network.domain.User;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByTopic_Id(Long id);

    int countByTopic_IdAndTimePostedAfterAndTimePostedBefore(Long id, LocalDateTime timePosted, LocalDateTime timePosted1);
    long countByTopic_Id(Long id);

    @Query("select distinct p from Post p where p.topic is not null")
    List<Post> findDistinctByTopicNotNull();
    @Query("select p from Post p where p.timePosted > ?1 and p.timePosted < ?2")
    List<Post> findByTimePostedGreaterThanAndTimePostedLessThan(LocalDateTime timePosted, LocalDateTime timePosted1);

    Page<Post> findByCreatorFollowersIn(Collection<User> followers, Pageable pageable);
    List<Post> findByCreatorFollowersIn(Collection<User> followers);
    Page<Post> findByCreatorId(Long id, Pageable pageable);
}
