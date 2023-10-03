package rs.ac.bg.fon.social_network.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import rs.ac.bg.fon.social_network.domain.Trend;

import java.util.List;

@Repository
public interface TrendRepository  extends JpaRepository<Trend, Long> {
    @Query("select t from Trend t where t.id = ?1")
    List<Trend> findTrendById(Long id);
    @Transactional
    @Modifying
    @Query("update Trend t set t.numberOfPosts = ?1 where t.id = ?2")
    int update(int numberOfPosts, Long id);
    @Transactional
    @Modifying
    @Query("update Trend t set t.numberOfPosts = 55 where t.id = ?1")
    int updateNumberOfPostsById(Long id);
    @Query("select (count(t) > 0) from Trend t where t.topic = ?1")
    boolean existsByTopic(String topic);

    @Query("select t from Trend t where t.topic = ?1")
    List<Trend> findByTopic(String topic);


    @Override
    List<Trend> findAll();

    @Override
    void deleteById(Long aLong);
}
