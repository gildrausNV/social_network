package rs.ac.bg.fon.social_network.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rs.ac.bg.fon.social_network.domain.Role;
import rs.ac.bg.fon.social_network.domain.User;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByFollowers_Id(Long id, Pageable pageable);
    Page<User> findByFollowing_Id(Long id, Pageable pageable);
    @Query("select u from User u where u.email = ?1")
    User findByEmail(String email);
    Page<User> findByRoleAndIdNot(Role role, Long id, Pageable pageable);
    Page<User> findByRoleAndId(Role role, Long id, Pageable pageable);
    List<User> findByUsernameContainsIgnoreCase(String username);
    Optional<User> findByUsername(String username);
}
