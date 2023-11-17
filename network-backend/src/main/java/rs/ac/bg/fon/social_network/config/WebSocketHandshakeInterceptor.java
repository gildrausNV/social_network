package rs.ac.bg.fon.social_network.config;

import lombok.RequiredArgsConstructor;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;
@RequiredArgsConstructor
public class WebSocketHandshakeInterceptor extends HttpSessionHandshakeInterceptor {
    private final JwtService jwtService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, org.springframework.web.socket.WebSocketHandler wsHandler, java.util.Map<java.lang.String, java.lang.Object> attributes) throws java.lang.Exception {
        String token = jwtService.extractTokenFromRequest(request);
        if (!jwtService.isTokenDefined(token)) {
            return false;
        }
        Authentication authentication = jwtService.createAuthenticationFromToken(token);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return true;
    }



}
