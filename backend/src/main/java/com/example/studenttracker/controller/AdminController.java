package com.example.studenttracker.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.studenttracker.model.Assignment;
import com.example.studenttracker.model.Attendance;
import com.example.studenttracker.model.Result;
import com.example.studenttracker.model.User;
import com.example.studenttracker.repository.AssignmentRepository;
import com.example.studenttracker.repository.AttendanceRepository;
import com.example.studenttracker.repository.ResultRepository;
import com.example.studenttracker.repository.UserRepository;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired 
    private UserRepository userRepo;
    @Autowired 
    private AssignmentRepository assignmentRepo;
    @Autowired 
    private ResultRepository resultRepo;
    @Autowired 
    private AttendanceRepository attendanceRepo;

    // ==================== STUDENTS ====================
    @GetMapping("/students")
    public List<User> allStudents() {
        // Return only students (filter out admins)
        return userRepo.findAll().stream()
                .filter(u -> "STUDENT".equalsIgnoreCase(u.getRole()))
                .toList();
    }

    @PostMapping("/students")
    public User createStudent(@RequestBody User u) {
        if (u.getRole() == null || u.getRole().isBlank()) {
            u.setRole("STUDENT");
        }
        // (Password should be hashed, but skipped here for simplicity)
        return userRepo.save(u);
    }

    @PutMapping("/students/{id}")
    public User updateStudent(@PathVariable Integer id, @RequestBody User u) {
        u.setId(id);
        return userRepo.save(u);
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudent(@PathVariable Integer id) {
        userRepo.deleteById(id);
    }

    // ==================== ASSIGNMENTS ====================
    @GetMapping("/assignments")
    public List<Assignment> getAllAssignments() {
        return assignmentRepo.findAll();
    }

    @PostMapping("/assignments")
    public Assignment addAssignment(@RequestBody Assignment a) {
        return assignmentRepo.save(a);
    }

    @PutMapping("/assignments/{id}")
    public Assignment updateAssignment(@PathVariable Integer id, @RequestBody Assignment a) {
        a.setId(id);
        return assignmentRepo.save(a);
    }

    @DeleteMapping("/assignments/{id}")
    public void deleteAssignment(@PathVariable Integer id) {
        assignmentRepo.deleteById(id);
    }

    // ==================== RESULTS ====================
    @GetMapping("/results")
    public List<Result> getAllResults() {
        return resultRepo.findAll();
    }

    @PostMapping("/results")
    public Result addResult(@RequestBody Result r) {
        return resultRepo.save(r);
    }

    @PutMapping("/results/{id}")
    public Result updateResult(@PathVariable Integer id, @RequestBody Result r) {
        r.setId(id);
        return resultRepo.save(r);
    }

    @DeleteMapping("/results/{id}")
    public void deleteResult(@PathVariable Integer id) {
        resultRepo.deleteById(id);
    }

    // ==================== ATTENDANCE ====================
    @GetMapping("/attendance")
    public List<Attendance> getAllAttendance() {
        return attendanceRepo.findAll();
    }

    @PostMapping("/attendance")
    public Attendance addAttendance(@RequestBody Attendance a) {
        return attendanceRepo.save(a);
    }

    @PutMapping("/attendance/{id}")
    public Attendance updateAttendance(@PathVariable Integer id, @RequestBody Attendance a) {
        a.setId(id);
        return attendanceRepo.save(a);
    }

    @DeleteMapping("/attendance/{id}")
    public void deleteAttendance(@PathVariable Integer id) {
        attendanceRepo.deleteById(id);
    }
}
