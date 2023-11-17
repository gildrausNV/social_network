package rs.ac.bg.fon.social_network.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.Topic;
import rs.ac.bg.fon.social_network.repository.PostRepository;
import rs.ac.bg.fon.social_network.repository.TopicRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final UserService userService;
    private final TopicRepository topicRepository;
    private final PostRepository postRepository;

    public List<Topic> getTopics(String period) {
        return switch (period) {
            case "month" -> getPopularTopicsThisMonth();
            case "today" -> getPopularTopicsToday();
            case "week" -> getPopularTopicsThisWeek();
            default -> topicRepository.findAll();
        };
    }

    public List<Topic> getPopularTopicsThisMonth() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth());
        LocalDateTime startOfMonthDateTime = startOfMonth.atStartOfDay();
        LocalDateTime endOfMonthDateTime = endOfMonth.atTime(23, 59, 59);


        List<Topic> topics = topicRepository.findAll();
        for(int i = 0; i < topics.size(); i++){
            if(postRepository.countByTopic_IdAndTimePostedAfterAndTimePostedBefore(topics.get(i).getId(), startOfMonthDateTime, endOfMonthDateTime) == 0){
                topics.remove(i);
            }
        }

        return topics;
    }

    public List<Topic> getPopularTopicsThisWeek() {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        LocalDateTime startOfWeekDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endOfWeekDateTime = endOfWeek.atTime(23, 59, 59);

        List<Topic> topics = topicRepository.findAll();
        for(int i = 0; i < topics.size(); i++){
            if(postRepository.countByTopic_IdAndTimePostedAfterAndTimePostedBefore(topics.get(i).getId(), startOfWeekDateTime, endOfWeekDateTime) == 0){
                topics.remove(i);
            }
        }

        return topics;
    }

    public List<Topic> getPopularTopicsToday() {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfDayDateTime = now.atStartOfDay();
        LocalDateTime endOfDayDateTime = now.atTime(23, 59, 59);

        List<Topic> topics = topicRepository.findAll();
        for(int i = 0; i < topics.size(); i++){
            if(postRepository.countByTopic_IdAndTimePostedAfterAndTimePostedBefore(topics.get(i).getId(), startOfDayDateTime, endOfDayDateTime) == 0){
                topics.remove(i);
            }
        }

        return topics;
    }

    public List<Topic> getTopicsById(Long id) {
        return topicRepository.findAllById(id);
    }

    public Topic getTopicIfExists(Topic topic) {
        if(topicRepository.existsByName(topic.getName())){
            topic = topicRepository.findByName(topic.getName());
        }
        else{
            topic = topicRepository.save(topic);
        }
        return topic;
    }

    public List<Topic> getAll() {
        return topicRepository.findAll();
    }

}
