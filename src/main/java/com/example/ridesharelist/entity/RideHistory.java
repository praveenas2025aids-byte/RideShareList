package com.example.ridesharelist.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class RideHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id", nullable = false)
    private RideOffer ride;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime completedAt;

    public RideHistory() {
    }

    public RideHistory(Long id, RideOffer ride, User user,
                       LocalDateTime completedAt) {
        this.id = id;
        this.ride = ride;
        this.user = user;
        this.completedAt = completedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RideOffer getRide() {
        return ride;
    }

    public void setRide(RideOffer ride) {
        this.ride = ride;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}