package rs.ac.bg.fon.social_network.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.lang.Nullable;
import rs.ac.bg.fon.social_network.domain.Topic;

import java.util.List;

public interface TopicRepository extends JpaRepository<Topic, Long> {
    @Query("select (count(t) > 0) from Topic t where t.name = ?1")
    boolean existsByName(String name);
    @Query("select t from Topic t where t.name = ?1")
    Topic findByName(@Nullable String name);

    List<Topic> findAllById(Long id);
}