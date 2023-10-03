package rs.ac.bg.fon.social_network.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import rs.ac.bg.fon.social_network.domain.Trend;
import rs.ac.bg.fon.social_network.service.TrendService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/trends")
@CrossOrigin
@RequiredArgsConstructor
public class TrendController {
    private final TrendService trendService;

    @GetMapping
    public List<Trend> getAll(Pageable pageable) {
        return trendService.getAll();
    }

    @GetMapping("/thisMonth")
    public List<Trend> getMonthly() { return trendService.getMonthly(); }

    @GetMapping("/thisWeek")
    public List<Trend> getWeekly() { return trendService.getPopularTopicsThisWeek(); }

    @GetMapping("/today")
    public List<Trend> getToday() { return trendService.getPopularTopicsToday(); }

    @GetMapping("/{id}")
    public List<Trend> getTrendInfo(@PathVariable Long id) { return trendService.getTrendsById(id); }
}
