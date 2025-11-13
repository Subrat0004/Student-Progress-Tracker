package com.example.studenttracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.studenttracker.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    boolean existsByEmail(String email);
    java.util.Optional<User> findByEmail(String email);
}
