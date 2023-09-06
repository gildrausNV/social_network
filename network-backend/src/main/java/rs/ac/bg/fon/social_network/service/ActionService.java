package rs.ac.bg.fon.social_network.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.Action;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.repository.ActionRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static java.util.stream.Collectors.groupingBy;

@Service
@RequiredArgsConstructor
public class ActionService {

    private final ActionRepository actionRepository;

    public void createAction(User user) {
        Action action = Action.builder()
                .timestamp(LocalDate.now())
                .user(user)
                .build();
        actionRepository.save(action);
    }

    public Map<LocalDate, List<Action>> getActionsByUser(Long userId) {
        return actionRepository.findByUserId(userId)
                .stream().collect(groupingBy(Action::getTimestamp));
    }
}
