package com.scems.controller;

import com.scems.model.Registration;
import com.scems.repository.RegistrationRepository;
import com.scems.model.Event;
import com.scems.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:5173")
public class RegistrationController {

    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    @GetMapping("/student/{studentId}")
    public List<Registration> getMyRegistrations(@PathVariable String studentId) {
        return registrationRepository.findByStudentId(studentId);
    }
    
    @GetMapping("/event/{eventId}")
    public List<Registration> getEventRegistrations(@PathVariable String eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    @PostMapping
    public ResponseEntity<?> registerForEvent(@Valid @RequestBody Registration reg) {
        // Find existing event
        return eventRepository.findByEventId(reg.getEventId())
            .map(event -> {
                // Check if seats available
                if (event.getRegisteredCount() >= event.getMaxSeats()) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Event is full"));
                }
                
                // Set registration details
                reg.setRegistrationId("reg-" + System.currentTimeMillis());
                reg.setRegisteredOn(LocalDate.now());
                reg.setStatus("upcoming"); // Default status
                
                // Update event registered count
                event.setRegisteredCount(event.getRegisteredCount() + 1);
                eventRepository.save(event);
                
                // Save and return registration
                return ResponseEntity.ok(registrationRepository.save(reg));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{regId}/feedback")
    public ResponseEntity<Registration> submitFeedback(@PathVariable String regId, @RequestBody Map<String, Object> feedback) {
        return registrationRepository.findByRegistrationId(regId)
                .map(reg -> {
                    if (feedback.containsKey("rating")) {
                        reg.setFeedbackRating(Integer.parseInt(feedback.get("rating").toString()));
                    }
                    if (feedback.containsKey("comment")) {
                        reg.setFeedbackComment(feedback.get("comment").toString());
                    }
                    return ResponseEntity.ok(registrationRepository.save(reg));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
