package com.example.studenttracker.controller;
import org.springframework.web.bind.annotation.*;
import com.example.studenttracker.repository.UserRepository;
import com.example.studenttracker.model.User;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/students")
@CrossOrigin
public class StudentController {
  @Autowired UserRepository repo;
  @GetMapping public List<User> all(){ return repo.findAll(); }
  @GetMapping("/{id}") public User get(@PathVariable Integer id){ return repo.findById(id).orElse(null); }
}
