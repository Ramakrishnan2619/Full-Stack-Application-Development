package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

// Task 5.3: CRUD application using Spring Boot for Postman
@RestController
@RequestMapping("/api/students")
public class StudentRestController {

    @Autowired
    private StudentRepository studentRepository;

    // CREATE
    @PostMapping
    public Student createStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    // READ (All)
    @GetMapping
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // READ (By ID)
    @GetMapping("/{id}")
    public Student getStudentById(@PathVariable Long id) {
        return studentRepository.findById(id).orElse(null);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student studentDetails) {
        Optional<Student> optionalStudent = studentRepository.findById(id);
        if (optionalStudent.isPresent()) {
            Student existing = optionalStudent.get();
            existing.setName(studentDetails.getName());
            existing.setEmail(studentDetails.getEmail());
            existing.setDepartment(studentDetails.getDepartment());
            existing.setAge(studentDetails.getAge());
            return studentRepository.save(existing);
        }
        return null; // For simplicity in Week 5
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {
        studentRepository.deleteById(id);
        return "Student " + id + " has been successfully deleted.";
    }

    // ---------------------------------------------------------
    // Task 5.4: Custom Spring Data JPA Query Endpoints
    // ---------------------------------------------------------

    // Find by Department (e.g. GET /api/students/department/CSE)
    @GetMapping("/department/{dept}")
    public List<Student> getStudentsByDepartment(@PathVariable String dept) {
        return studentRepository.findByDepartment(dept);
    }

    // Find by Age Greater Than (e.g. GET /api/students/age-greater-than/20)
    @GetMapping("/age-greater-than/{age}")
    public List<Student> getStudentsByAge(@PathVariable int age) {
        return studentRepository.findByAgeGreaterThan(age);
    }
}
