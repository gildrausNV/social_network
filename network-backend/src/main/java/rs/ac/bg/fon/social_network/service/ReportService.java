package rs.ac.bg.fon.social_network.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.Post;
import rs.ac.bg.fon.social_network.domain.Report;
import rs.ac.bg.fon.social_network.domain.Role;
import rs.ac.bg.fon.social_network.domain.User;
import rs.ac.bg.fon.social_network.repository.ReportRepository;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserService userService;
    private final PostService postService;
    private final ActionService actionService;

    public Page<Report> getAll(Pageable pageable) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        if (!currentlyLoggedInUser.getRole().equals(Role.ADMIN))
            throw new AccessDeniedException("Only admin can access reports");
        return reportRepository.findAll(pageable);
    }

    public Report getById(Long id) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        if (!currentlyLoggedInUser.getRole().equals(Role.ADMIN))
            throw new AccessDeniedException("Only admin can access reports");
        return reportRepository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public Report reportPost(Post reportedPost) {
        if (reportRepository.existsByReportedPostId(reportedPost.getId())) {
            throw new IllegalStateException("You cannot report a post multiple times");
        }
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        Report report = Report.builder()
                .reportedPost(reportedPost)
                .reporter(currentlyLoggedInUser)
                .timestamp(LocalDateTime.now())
                .build();
        actionService.createAction(userService.getCurrentlyLoggedInUser());
        return reportRepository.save(report);
    }

    public Report reportPost(Long reportedPostId) {
        Post postToReport = postService.getById(reportedPostId);
        if (reportRepository.existsByReportedPostId(reportedPostId)) {
            throw new IllegalStateException("You cannot report a post multiple times");
        }
        return reportPost(postToReport);
    }

    public void deleteReport(Long reportId) {
        if (reportRepository.existsById(reportId)) {
            reportRepository.deleteById(reportId);
        }
    }
}
