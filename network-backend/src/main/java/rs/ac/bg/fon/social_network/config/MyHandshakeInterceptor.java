package rs.ac.bg.fon.social_network.config;

import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class MyHandshakeInterceptor extends HttpSessionHandshakeInterceptor {
    private final JwtService jwtService;

    @Autowired
    public MyHandshakeInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, org.springframework.web.socket.WebSocketHandler wsHandler, java.util.Map<java.lang.String, java.lang.Object> attributes) throws java.lang.Exception {
        // Extract and validate the token here
        String token = extractTokenFromRequest(request);
        if (validateToken(token)) {
            // Set the user's credentials if the token is valid
            Authentication authentication = createAuthenticationFromToken(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            return true;
        } else {
            // Token is invalid, reject the handshake
            return false;
        }
    }

    private String extractTokenFromRequest(ServerHttpRequest request) {
        // Example: Extract the token from the "token" query parameter
        String token = request.getURI().getQuery().split("=")[1];
        System.out.println("Extracted token: " + token); // Log the token
        return token;
    }


    private boolean validateToken(String token) {
        return token != null && !token.isEmpty();
    }

    private Authentication createAuthenticationFromToken(String token) {
        // Example: Create a UserDetails object and wrap it in an Authentication object
        UserDetails userDetails = createUserDetailsFromToken(token);
        System.out.println("DA LI RADI:  " + userDetails.toString());
        return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
    }

    private UserDetails createUserDetailsFromToken(String token) {
        // Parse the JWT token to get its claims
        Claims claims = jwtService.extractAllClaims(token);

        // Extract the username and roles (authorities) from the claims
        String username = claims.getSubject(); // Assuming the username is stored in the subject claim
        List<GrantedAuthority> authorities = extractAuthoritiesFromClaims(claims);

        // Create a UserDetails object with the parsed information
        return new User(username, "", authorities);
    }

    private List<GrantedAuthority> extractAuthoritiesFromClaims(Claims claims) {
        // Extract and map roles/authorities from the token claims (if available)
        // For example, you might have a custom claim "roles" that holds the roles
        List<String> roles = claims.get("roles", List.class);

        // Convert roles to GrantedAuthority objects
        if (roles != null) {
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority(role))
                    .collect(Collectors.toList());
        } else {
            // If no roles are present in the claims, return an empty list or a default role
            return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        }
    }


}
