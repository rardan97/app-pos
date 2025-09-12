package com.blackcode.pos_be.security.jwt;

import com.blackcode.pos_be.exception.InvalidJwtException;
import com.blackcode.pos_be.exception.TokenExpiredException;
import com.blackcode.pos_be.model.petugas.Petugas;
import com.blackcode.pos_be.model.petugas.PetugasToken;
import com.blackcode.pos_be.repository.PetugasRepository;
import com.blackcode.pos_be.repository.PetugasTokenRepository;
import com.blackcode.pos_be.security.service.PetugasDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class AuthTokenFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    private final PetugasDetailsServiceImpl petugasDetailsService;

    private final PetugasTokenRepository petugasTokenRepository;

    private final PetugasRepository petugasRepository;

    private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

    public AuthTokenFilter(JwtUtils jwtUtils,
                           PetugasDetailsServiceImpl petugasDetailsService,
                           PetugasTokenRepository petugasTokenRepository,
                           PetugasRepository petugasRepository) {
        this.jwtUtils = jwtUtils;
        this.petugasDetailsService = petugasDetailsService;
        this.petugasTokenRepository = petugasTokenRepository;
        this.petugasRepository = petugasRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try{
            System.out.println("Proccess 1 authtokenfilter");
            String jwt = parseJwt(request);
            System.out.println("Incoming JWT Token: " + jwt);
            if(jwt != null){
                jwtUtils.assertValidToken(jwt);

                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                Optional<Petugas> dataPetugas = petugasRepository.findByPetugasUsername(username);
                if (dataPetugas.isEmpty()) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "User not found");
                    return;
                }

                Petugas petugas = dataPetugas.get();
                Optional<PetugasToken> dataPetugasToken = petugasTokenRepository.findByPetugasId(petugas.getPetugasId());
                if (dataPetugasToken.isEmpty()) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token not found");
                    return;
                }

                PetugasToken petugasToken = dataPetugasToken.get();

                if (!petugasToken.getToken().equals(jwt)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token has been invalidated");
                    return;
                }

                if (!petugasToken.getIsActive()) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token is inactive or expired");
                    return;
                }

                UserDetails userDetails = petugasDetailsService.loadUserByUsername(username);
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(auth);

            }
        }catch (TokenExpiredException e) {
            logger.warn("Expired token: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token expired");
            return;
        } catch (InvalidJwtException e) {
            logger.warn("Invalid token: {}", e.getMessage());
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
            return;
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e.getMessage(), e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication error");
            return;
        }
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request){
        String headerAuth = request.getHeader("Authorization");
        if(StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")){
            return headerAuth.substring(7);
        }
        return null;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return !request.getRequestURI().startsWith("/api/petugas/");
    }
}
