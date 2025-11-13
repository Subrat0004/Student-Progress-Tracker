package com.example.studenttracker.controller;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.studenttracker.model.Assignment;
import com.example.studenttracker.repository.AssignmentRepository;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin
public class AssignmentController {

    @Autowired
    private AssignmentRepository repo;

    // ✅ Admin: Get all assignments
    @GetMapping
    public List<Assignment> all() {
        return repo.findAll();
    }

    // ✅ Student: Get assignments for a specific student
    @GetMapping("/student/{studentId}")
    public List<Assignment> byStudent(@PathVariable Integer studentId) {
        return repo.findByStudentId(studentId);
    }

    // ✅ Admin: Create a new assignment
    @PostMapping
    public Assignment create(@RequestBody Assignment a) {
        return repo.save(a);
    }

    // ✅ Admin: Update a full assignment
    @PutMapping("/{id}")
    public Assignment update(@PathVariable Integer id, @RequestBody Assignment a) {
        a.setId(id);
        return repo.save(a);
    }

    // ✅ Admin: Delete assignment
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        repo.deleteById(id);
    }

    // ✅ Student: Update only assignment status
    @PutMapping("/{id}/status")
    public Object updateStatus(@PathVariable Integer id, @RequestBody Map<String, String> body) {
        Optional<Assignment> opt = repo.findById(id);

        if (opt.isEmpty()) {
            return Map.of("error", "Assignment not found");
        }

        Assignment a = opt.get();
        String status = body.get("status");

        if (status == null || status.isBlank()) {
            return Map.of("error", "No status provided");
        }

        a.setStatus(status.toUpperCase());
        repo.save(a);

        return Map.of("message", "Status updated", "status", a.getStatus());
    }
}
