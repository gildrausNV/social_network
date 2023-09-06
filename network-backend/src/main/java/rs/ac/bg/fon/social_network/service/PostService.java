package rs.ac.bg.fon.social_network.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.domain.*;
import rs.ac.bg.fon.social_network.repository.CommentRepository;
import rs.ac.bg.fon.social_network.repository.PostRepository;
import rs.ac.bg.fon.social_network.repository.ReactionRepository;
import rs.ac.bg.fon.social_network.repository.ReportRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserService userService;
    private final ReactionRepository reactionRepository;
    private final CommentRepository commentRepository;
    private final ReportRepository reportRepository;
    private final ActionService actionService;

    public List<Post> getAll() {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN))
            return postRepository.findAll();
        return postRepository
                .findAll()
                .stream()
                .filter(post -> post.getCreator().getFollowers().contains(currentlyLoggedInUser))
                .toList();
    }

    public Post getById(Long id) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN)) {
            return postRepository.findById(id).orElseThrow(NoSuchElementException::new);
        }
        Post post = postRepository.findById(id).orElseThrow(NoSuchElementException::new);
        boolean hasAccess = currentlyLoggedInUser.getFollowing().contains(post.getCreator());
        if (!hasAccess) {
            throw new NoSuchElementException();
        }
        return post;
    }

    public Post savePost(Post post) {
        if (userService.getCurrentlyLoggedInUser().getRole().equals(Role.ADMIN)) {
            throw new IllegalStateException("You must be logged in as regular user to create a post");
        }
        actionService.createAction(userService.getCurrentlyLoggedInUser());
        post.setCreator(userService.getCurrentlyLoggedInUser());
        post.setTimePosted(LocalDateTime.now());
        return postRepository.save(post);
    }

    public void deletePost(Long postId) {
        if (postRepository.existsById(postId)) {
            reportRepository.deleteAll(reportRepository.findByReportedPostId(postId));
            reactionRepository.deleteAll(reactionRepository.findByPostId(postId));
            commentRepository.deleteAll(commentRepository.findByPostId(postId));
            actionService.createAction(userService.getCurrentlyLoggedInUser());
            postRepository.deleteById(postId);
        }
    }

    public Reaction reactToPost(Long postId, Reaction reaction) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        Post postToReact = getById(postId);
        reaction.setPost(postToReact);
        reaction.setTimestamp(LocalDateTime.now());
        reaction.setLikedByUser(currentlyLoggedInUser);
        reaction.setReactionType(reaction.getReactionType());

        actionService.createAction(userService.getCurrentlyLoggedInUser());

        return reactionRepository.save(reaction);
    }

    public Page<Reaction> getReactionsById(Long postId, Pageable pageable) {
        return reactionRepository.findByPostId(postId, pageable);
    }

    public Comment commentPost(Long postId, Comment comment) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();
        Post postForCommenting = getById(postId);
        comment.setPost(postForCommenting);
        comment.setTimePosted(LocalDateTime.now());
        comment.setCreator(currentlyLoggedInUser);

        actionService.createAction(userService.getCurrentlyLoggedInUser());

        return commentRepository.save(comment);
    }

    public Page<Comment> getAllCommentsForPost(Long postId, Pageable pageable) {
        return commentRepository.findByPostId(postId, pageable);
    }

    public Page<Post> getAllByUser(Long userId, Pageable pageable) {
        User currentlyLoggedInUser = userService.getCurrentlyLoggedInUser();

        if (currentlyLoggedInUser.getRole().equals(Role.ADMIN))
            return postRepository.findByCreatorId(userId, pageable);

        User user = userService.getById(userId);
        if (!currentlyLoggedInUser.getFollowing().contains(user) && !currentlyLoggedInUser.equals(user)) {
            throw new AccessDeniedException("You cannot access posts from user that you do not follow!");
        }
        return postRepository.findByCreatorId(userId, pageable);
    }
}
