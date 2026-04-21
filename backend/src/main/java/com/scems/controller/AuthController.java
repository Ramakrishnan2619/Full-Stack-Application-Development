package com.scems.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    // Simple mock auth for demonstration purposes
    // Real implementation would use Spring Security JWT

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("email"); // Front-end uses email field for both
        String password = credentials.get("password");

        // Admin login check
        if ("Rama".equals(username) && "vtu24465".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            
            Map<String, String> user = new HashMap<>();
            user.put("id", "A001");
            user.put("name", "Rama");
            user.put("role", "admin");
            user.put("department", "Administration");
            user.put("email", "rama@college.edu");
            
            response.put("user", user);
            response.put("token", "mock-jwt-token-A001");
            return ResponseEntity.ok(response);
        }
        
        // Mock Student login (accepts anything with @ for demo)
        if (username != null && username.contains("@") && "student".equals(password)) {
            Map<String, Object> response = new HashMap<>();
            
            Map<String, Object> user = new HashMap<>();
            user.put("id", "S001");
            user.put("name", "Arjun Kumar");
            user.put("role", "student");
            user.put("rollNo", "21CS045");
            user.put("department", "CSE");
            user.put("year", 3);
            user.put("email", username);
            
            response.put("user", user);
            response.put("token", "mock-jwt-token-S001");
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
    }
}
