package com.example.studenttracker.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studenttracker.model.User;
import com.example.studenttracker.repository.UserRepository;

@RestController
@RequestMapping("/api/users")
@CrossOrigin
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ Get specific user by ID
    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Integer id) {
        return userRepository.findById(id);
    }

    // ✅ Delete user (optional for admin panel)
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userRepository.deleteById(id);
    }
}
