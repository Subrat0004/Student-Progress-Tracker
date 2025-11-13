package com.example.studenttracker.repository;

import com.example.studenttracker.model.Result;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ResultRepository extends JpaRepository<Result,Integer> { List<Result> findByStudentId(Integer studentId); }
