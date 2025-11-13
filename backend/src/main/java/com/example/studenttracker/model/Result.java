package com.example.studenttracker.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity
@Table(name = "results")
public class Result {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  private Integer studentId;
  private String subject;
  private Double marks;
  private Double maxMarks;
  private LocalDate examDate;
  // getters/setters
  public Integer getId(){return id;} public void setId(Integer id){this.id=id;}
  public Integer getStudentId(){return studentId;} public void setStudentId(Integer studentId){this.studentId=studentId;}
  public String getSubject(){return subject;} public void setSubject(String subject){this.subject=subject;}
  public Double getMarks(){return marks;} public void setMarks(Double marks){this.marks=marks;}
  public Double getMaxMarks(){return maxMarks;} public void setMaxMarks(Double maxMarks){this.maxMarks=maxMarks;}
  public LocalDate getExamDate(){return examDate;} public void setExamDate(LocalDate examDate){this.examDate=examDate;}
}
