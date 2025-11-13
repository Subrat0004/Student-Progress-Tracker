package com.example.studenttracker.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.studenttracker.repository.UserRepository;

@Configuration
public class SecurityConfig {

  @Autowired JwtUtils jwtUtils;
  @Autowired UserRepository userRepository;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    JwtAuthFilter jwtFilter = new JwtAuthFilter(jwtUtils, userRepository);

    http.csrf(csrf -> csrf.disable())
       .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
       .authorizeHttpRequests(auth -> auth
          .requestMatchers("/api/auth/**").permitAll()
          .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
          .requestMatchers("/api/admin/**").hasRole("ADMIN")
          .requestMatchers("/api/**").authenticated()
          .anyRequest().permitAll()
       );

    http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

  @Bean public PasswordEncoder passwordEncoder(){ return new BCryptPasswordEncoder(); }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
    return config.getAuthenticationManager();
  }
}
