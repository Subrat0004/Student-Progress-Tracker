package com.example.studenttracker.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.studenttracker.repository.ResultRepository;
import com.example.studenttracker.model.Result;
import java.util.List;

@RestController
@RequestMapping("/api/results")
@CrossOrigin
public class ResultController {
  @Autowired ResultRepository repo;
  @GetMapping public List<Result> all(){ return repo.findAll(); }
  @GetMapping("/student/{studentId}") public List<Result> byStudent(@PathVariable Integer studentId){ return repo.findByStudentId(studentId); }
  @PostMapping public Result create(@RequestBody Result r){ return repo.save(r); }
}
