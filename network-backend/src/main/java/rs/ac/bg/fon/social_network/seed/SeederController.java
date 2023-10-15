package rs.ac.bg.fon.social_network.seed;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/seed")
@CrossOrigin
@RequiredArgsConstructor
public class SeederController {

    private final FakeService fakeService;

    @GetMapping
    public void seed() {
//        fakeService.seedUsers();
        fakeService.seedAdmin();
    }

}
