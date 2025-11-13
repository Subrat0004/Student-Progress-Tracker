package com.example.studenttracker.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.studenttracker.model.Assignment;

public interface AssignmentRepository extends JpaRepository<Assignment, Integer> {
    List<Assignment> findByStudentId(Integer studentId);
}
