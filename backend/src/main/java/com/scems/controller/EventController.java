package com.scems.controller;

import com.scems.model.Event;
import com.scems.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventRepository eventRepository;

    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        return eventRepository.findByEventId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/category/{categoryId}")
    public List<Event> getEventsByCategory(@PathVariable String categoryId) {
        return eventRepository.findByCategoryId(categoryId);
    }

    @PostMapping
    public Event createEvent(@Valid @RequestBody Event event) {
        event.setEventId("evt-new-" + System.currentTimeMillis());
        return eventRepository.save(event);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @Valid @RequestBody Event eventDetails) {
        return eventRepository.findByEventId(id)
                .map(event -> {
                    event.setTitle(eventDetails.getTitle());
                    event.setCategoryId(eventDetails.getCategoryId());
                    event.setDepartment(eventDetails.getDepartment());
                    event.setDate(eventDetails.getDate());
                    event.setTime(eventDetails.getTime());
                    event.setVenue(eventDetails.getVenue());
                    event.setDuration(eventDetails.getDuration());
                    event.setMaxSeats(eventDetails.getMaxSeats());
                    event.setDescription(eventDetails.getDescription());
                    event.setOrganizer(eventDetails.getOrganizer());
                    event.setBannerColor(eventDetails.getBannerColor());
                    event.setTags(eventDetails.getTags());
                    return ResponseEntity.ok(eventRepository.save(event));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        return eventRepository.findByEventId(id)
                .map(event -> {
                    eventRepository.delete(event);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
