package rs.ac.bg.fon.social_network.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import rs.ac.bg.fon.social_network.domain.Role;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers("/api/v1/seed**").permitAll()


                        .requestMatchers(HttpMethod.DELETE, "/api/v1/reports**").hasAuthority(Role.ADMIN.getAuthority())
                        .requestMatchers(HttpMethod.GET, "/api/v1/reports**").hasAuthority(Role.ADMIN.getAuthority())


                        .requestMatchers(HttpMethod.POST, "/api/v1/reports**").hasAuthority(Role.USER.getAuthority())

                        .requestMatchers("/api/v1/notifications**").hasAuthority(Role.USER.getAuthority())

                        .requestMatchers(HttpMethod.POST, "/api/v1/posts**").hasAuthority(Role.USER.getAuthority())

                        .requestMatchers("/api/v1/users/follow/**").hasAuthority(Role.USER.getAuthority())
                        .requestMatchers("/api/v1/users/unfollow/**").hasAuthority(Role.USER.getAuthority())
                        .requestMatchers("/api/v1/users/followers").hasAuthority(Role.USER.getAuthority())
                        .requestMatchers("/api/v1/users/following").hasAuthority(Role.USER.getAuthority())

                        .anyRequest().authenticated())
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
