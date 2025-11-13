package com.example.studenttracker.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studenttracker.model.User;
import com.example.studenttracker.repository.UserRepository;
import com.example.studenttracker.security.JwtUtils;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired 
    UserRepository userRepository;

    @Autowired 
    PasswordEncoder passwordEncoder;

    @Autowired 
    JwtUtils jwtUtils;

    // ✅ STUDENT-ONLY SIGNUP
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {

        String email = body.get("email");

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(
                Map.of("error", "Email already taken")
            );
        }

        User u = new User();
        u.setName(body.get("name"));
        u.setEmail(email);

        // ✅ Hash the password
        u.setPassword(passwordEncoder.encode(body.get("password")));

        // ✅ Student roll number
        u.setRollNo(body.getOrDefault("rollNo", ""));

        // ✅ FORCE ROLE TO STUDENT (no admin signup)
        u.setRole("STUDENT");

        userRepository.save(u);

        return ResponseEntity.ok(
            Map.of("message", "registered")
        );
    }

    // ✅ LOGIN (Admin & Student)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {

        String email = body.get("email");
        String pass = body.get("password");

        return userRepository.findByEmail(email).map(u -> {

            if (passwordEncoder.matches(pass, u.getPassword())) {

                String token = jwtUtils.generateToken(u.getEmail());

                return ResponseEntity.ok(
                    Map.of(
                        "token", token,
                        "user", Map.of(
                            "id", u.getId(),
                            "name", u.getName(),
                            "email", u.getEmail(),
                            "role", u.getRole(),   // ✅ role returned for redirect
                            "rollNo", u.getRollNo()
                        )
                    )
                );

            } else {
                return ResponseEntity.status(401).body(
                    Map.of("error", "Invalid credentials")
                );
            }

        }).orElse(
            ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"))
        );
    }
}
