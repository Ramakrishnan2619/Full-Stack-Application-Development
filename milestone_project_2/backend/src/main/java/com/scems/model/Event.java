package com.scems.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String eventId; // Like evt-001

    @NotNull(message = "Title cannot be null")
    @Size(min = 3, message = "Title must be at least 3 characters long")
    @Column(nullable = false)
    private String title;

    @NotNull(message = "Category ID cannot be null")
    @Column(nullable = false)
    private String categoryId;

    @NotNull(message = "Department cannot be null")
    @Column(nullable = false)
    private String department;

    @NotNull(message = "Date cannot be null")
    @Column(nullable = false)
    private LocalDate date;

    @NotNull(message = "Time cannot be null")
    @Column(nullable = false)
    private LocalTime time;

    @NotNull(message = "Venue cannot be null")
    @Column(nullable = false)
    private String venue;

    private String duration;

    @Column(name = "max_seats")
    private Integer maxSeats;

    @Column(name = "registered_count")
    private Integer registeredCount = 0;

    @Column(length = 1000)
    private String description;

    private String organizer;
    
    private String bannerColor;
    
    private Boolean isTrending;
    
    // Simplification for basic model - could be a separate table
    private String tags; 
}
