package com.example.studenttracker.model;
import jakarta.persistence.*;
import java.time.LocalDate;
@Entity
@Table(name = "attendance")
public class Attendance {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;
  private Integer studentId;
  private LocalDate date;
  private String status;
  private String notes;
  // getters/setters
  public Integer getId(){return id;} public void setId(Integer id){this.id=id;}
  public Integer getStudentId(){return studentId;} public void setStudentId(Integer studentId){this.studentId=studentId;}
  public LocalDate getDate(){return date;} public void setDate(LocalDate date){this.date=date;}
  public String getStatus(){return status;} public void setStatus(String status){this.status=status;}
  public String getNotes(){return notes;} public void setNotes(String notes){this.notes=notes;}
}
