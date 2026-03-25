package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;

@Controller
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/saveStudent")
    public String saveStudent(
            @RequestParam String name,
            @RequestParam String email) {

        Student student = new Student();
        student.setName(name);
        student.setEmail(email);

        studentRepository.save(student); // 🔥 STORES INTO MYSQL

        return "success";
    }
}