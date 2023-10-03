package rs.ac.bg.fon.social_network.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.Post;
import rs.ac.bg.fon.social_network.domain.Trend;
import rs.ac.bg.fon.social_network.repository.PostRepository;
import rs.ac.bg.fon.social_network.repository.TrendRepository;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TrendService {

    private final UserService userService;
    private final TrendRepository trendRepository;
    private final PostRepository postRepository;

    public List<Trend> getAll() {
        return trendRepository.findAll();
    }

    public Trend save(Trend trend) {

        String topic = trend.getTopic();
        List<Trend> trends = trendRepository.findByTopic(topic);

        if (!trends.isEmpty()) {
            int currentNumberOfPosts = trends.get(0).getNumberOfPosts();
            trend.setNumberOfPosts(currentNumberOfPosts + 1);
            trendRepository.updateNumberOfPostsById(trends.get(0).getId());
            return trend;
        } else {
            trend.setNumberOfPosts(1);
            return trendRepository.save(trend);
        }

    }

    public List<Trend> getMonthly() {
        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate endOfMonth = now.with(TemporalAdjusters.lastDayOfMonth());
        LocalDateTime startOfMonthDateTime = startOfMonth.atStartOfDay();
        LocalDateTime endOfMonthDateTime = endOfMonth.atTime(23, 59, 59);

        List<Post> posts = postRepository.findByTimePostedGreaterThanAndTimePostedLessThan(startOfMonthDateTime, endOfMonthDateTime);
        List<Trend> trends = new ArrayList<>();

        for (Post post:
             posts) {
            if(!trends.contains(post.getTrend())){
                post.getTrend().setNumberOfPosts(1);
                trends.add(post.getTrend());
            }
            else{
                for (Trend trend :
                        trends) {
                    if(trend.getTopic().equals(post.getTrend().getTopic())) {
                        trend.setNumberOfPosts(trend.getNumberOfPosts() + 1);
                        break;
                    }
                }
            }
        }

        return trends;
    }

    public List<Trend> getPopularTopicsThisWeek() {
        LocalDate now = LocalDate.now();
        LocalDate startOfWeek = now.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        LocalDateTime startOfWeekDateTime = startOfWeek.atStartOfDay();
        LocalDateTime endOfWeekDateTime = endOfWeek.atTime(23, 59, 59);

        List<Post> posts = postRepository.findByTimePostedGreaterThanAndTimePostedLessThan(startOfWeekDateTime, endOfWeekDateTime);
        List<Trend> trends = new ArrayList<>();

        for (Post post:
                posts) {
            if(!trends.contains(post.getTrend())){
                post.getTrend().setNumberOfPosts(1);
                trends.add(post.getTrend());
            }
            else{
                for (Trend trend :
                        trends) {
                    if(trend.getTopic().equals(post.getTrend().getTopic())) {
                        trend.setNumberOfPosts(trend.getNumberOfPosts() + 1);
                        break;
                    }
                }
            }
        }

        return trends;
    }

    public List<Trend> getPopularTopicsToday() {
        LocalDate now = LocalDate.now();
        LocalDateTime startOfDayDateTime = now.atStartOfDay();
        LocalDateTime endOfDayDateTime = now.atTime(23, 59, 59);

        List<Post> posts = postRepository.findByTimePostedGreaterThanAndTimePostedLessThan(startOfDayDateTime, endOfDayDateTime);
        List<Trend> trends = new ArrayList<>();

        for (Post post:
                posts) {
            if(!trends.contains(post.getTrend())){
                post.getTrend().setNumberOfPosts(1);
                trends.add(post.getTrend());
            }
            else{
                for (Trend trend :
                        trends) {
                    if(trend.getTopic().equals(post.getTrend().getTopic())) {
                        trend.setNumberOfPosts(trend.getNumberOfPosts() + 1);
                        break;
                    }
                }
            }
        }

        return trends;
    }

    public List<Trend> getTrendsById(Long id){
        return trendRepository.findTrendById(id);
    }

}
