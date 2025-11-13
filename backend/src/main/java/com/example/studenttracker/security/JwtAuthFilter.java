package com.example.studenttracker.security;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.studenttracker.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtAuthFilter extends OncePerRequestFilter {
  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;

  public JwtAuthFilter(JwtUtils jwtUtils, UserRepository userRepository){
    this.jwtUtils = jwtUtils;
    this.userRepository = userRepository;
  }

  @Override
  protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
      throws ServletException, IOException {

    String header = request.getHeader("Authorization");
    if (StringUtils.hasText(header) && header.startsWith("Bearer ")) {
      String token = header.substring(7);
      if (jwtUtils.validateToken(token)) {
        String email = jwtUtils.getUsernameFromToken(token);
        userRepository.findByEmail(email).ifPresent(user -> {
          var authority = new SimpleGrantedAuthority("ROLE_" + user.getRole()); // ROLE_ADMIN / ROLE_STUDENT
          var auth = new UsernamePasswordAuthenticationToken(user, null, List.of(authority));
          auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
          SecurityContextHolder.getContext().setAuthentication(auth);
        });
      }
    }
    chain.doFilter(request, response);
  }
}
