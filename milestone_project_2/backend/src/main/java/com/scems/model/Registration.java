package com.scems.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String registrationId;

    @NotNull(message = "Event ID cannot be null")
    @Column(nullable = false)
    private String eventId;

    @NotNull(message = "Student ID cannot be null")
    @Column(nullable = false)
    private String studentId;

    @NotNull(message = "Status cannot be null")
    @Column(nullable = false)
    private String status; // 'upcoming', 'completed', 'cancelled'

    @Column(name = "registered_on")
    private LocalDate registeredOn;

    @Column(name = "payment_id")
    private String paymentId;

    @Column(name = "amount_paid")
    private Double amountPaid;

    private Integer feedbackRating;
    
    @Column(length = 500)
    private String feedbackComment;
}
