package rs.ac.bg.fon.social_network.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import rs.ac.bg.fon.social_network.domain.Comment;
import rs.ac.bg.fon.social_network.domain.Post;
import rs.ac.bg.fon.social_network.domain.Reaction;
import rs.ac.bg.fon.social_network.service.PostService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/posts")
@CrossOrigin
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping
    public List<Post> getAll() {
        return postService.getAll();
    }

    @GetMapping("/users/{userId}")
    public Page<Post> getAll(@PathVariable Long userId, Pageable pageable) {
        return postService.getAllByUser(userId, pageable);
    }

    @GetMapping("/{id}")
    public Post getById(@PathVariable Long id) {
        return postService.getById(id);
    }

    @PostMapping
    public Post savePost(@RequestBody Post post) {
        return postService.savePost(post);
    }

    @DeleteMapping("/{id}")
    public void deletePost(@PathVariable Long id) {
        postService.deletePost(id);
    }

    @PostMapping("/{postId}/react")
    public Reaction reactToPost(@PathVariable Long postId, @RequestBody Reaction reaction) {
        return postService.reactToPost(postId, reaction);
    }

    @GetMapping("/{postId}/reactions")
    public Page<Reaction> getReactionsForPostById(@PathVariable Long postId, Pageable pageable) {
        return postService.getReactionsById(postId, pageable);
    }

    @PostMapping("/{postId}/comment")
    public Comment commentOnPost(@PathVariable Long postId, @RequestBody Comment comment) {
        return postService.commentPost(postId, comment);
    }

    @GetMapping("/{postId}/comments")
    public Page<Comment> getCommentsForPostById(@PathVariable Long postId, Pageable pageable) {
        return postService.getAllCommentsForPost(postId, pageable);
    }

}
