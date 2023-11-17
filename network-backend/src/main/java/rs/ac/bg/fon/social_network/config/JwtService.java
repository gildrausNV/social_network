package rs.ac.bg.fon.social_network.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import rs.ac.bg.fon.social_network.repository.UserRepository;

import java.security.Key;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JwtService {
  private final UserRepository userRepository;

  private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject);
  }

  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token);
    return claimsResolver.apply(claims);
  }

  public String generateToken(UserDetails userDetails) {
    return generateToken(new HashMap<>(), userDetails);
  }

  public String generateToken(
      Map<String, Object> extraClaims,
      UserDetails userDetails
  ) {
    return Jwts
        .builder()
        .setClaims(extraClaims)
        .setSubject(userDetails.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
        .signWith(getSignInKey(), SignatureAlgorithm.HS256)
        .compact();
  }

  public boolean isTokenValid(String token, UserDetails userDetails) {
    final String username = extractUsername(token);
    return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
  }

  private boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date());
  }

  private Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration);
  }

  public Claims extractAllClaims(String token) {
    return Jwts
        .parserBuilder()
        .setSigningKey(getSignInKey())
        .build()
        .parseClaimsJws(token)
        .getBody();
  }

  private Key getSignInKey() {
    byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
    return Keys.hmacShaKeyFor(keyBytes);
  }

  public String extractTokenFromRequest(ServerHttpRequest request) {
    // Example: Extract the token from the "token" query parameter
    String token = request.getURI().getQuery().split("=")[1];
    System.out.println("Extracted token: " + token); // Log the token
    return token;
  }


  public boolean isTokenDefined(String token) {
    return token != null && !token.isEmpty();
  }

  public Authentication createAuthenticationFromToken(String token) {
    UserDetails userDetails = createUserDetailsFromToken(token);
    return new UsernamePasswordAuthenticationToken(userDetails, token, userDetails.getAuthorities());
  }

  public UserDetails createUserDetailsFromToken(String token) {
    Claims claims = extractAllClaims(token);

    String username = claims.getSubject();
    List<GrantedAuthority> authorities = extractAuthoritiesFromClaims(claims);
    return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
  }

  public List<GrantedAuthority> extractAuthoritiesFromClaims(Claims claims) {
    List<String> roles = claims.get("roles", List.class);

    if (roles != null) {
      return roles.stream()
              .map(SimpleGrantedAuthority::new)
              .collect(Collectors.toList());
    } else {
      return Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
    }
  }

}
