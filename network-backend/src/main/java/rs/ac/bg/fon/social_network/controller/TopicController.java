package rs.ac.bg.fon.social_network.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import rs.ac.bg.fon.social_network.domain.Topic;
import rs.ac.bg.fon.social_network.service.TopicService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/topics")
@CrossOrigin
@RequiredArgsConstructor
public class TopicController {
    private final TopicService topicService;

    @GetMapping
    public List<Topic> getAll() { return topicService.getAll(); }

    @GetMapping("/month")
    public List<Topic> getAllMonth() {
        return topicService.getTopics("month");
    }

    @GetMapping("/week")
    public List<Topic> getAllWeek() {
        return topicService.getTopics("week");
    }

    @GetMapping("/today")
    public List<Topic> getAllToday() { return topicService.getTopics("today"); }

    @GetMapping("/{id}")
    public List<Topic> getTrendInfo(@PathVariable Long id) { return topicService.getTopicsById(id); }
}
