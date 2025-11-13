package com.example.studenttracker.controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.studenttracker.repository.AttendanceRepository;
import com.example.studenttracker.model.Attendance;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin
public class AttendanceController {
  @Autowired AttendanceRepository repo;
  @GetMapping public List<Attendance> all(){ return repo.findAll(); }
  @GetMapping("/student/{studentId}") public List<Attendance> byStudent(@PathVariable Integer studentId){ return repo.findByStudentId(studentId); }
  @PostMapping public Attendance mark(@RequestBody Attendance a){ return repo.save(a); }
}
