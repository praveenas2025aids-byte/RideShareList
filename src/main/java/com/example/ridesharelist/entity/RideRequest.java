package com.example.ridesharelist.entity;

import jakarta.persistence.*;

@Entity
public class RideRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id", nullable = false)
    private RideOffer ride;

    @ManyToOne
    @JoinColumn(name = "rider_id", nullable = false)
    private User rider;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    public RideRequest() {
    }

    public RideRequest(Long id, RideOffer ride, User rider,
                       RequestStatus status) {
        this.id = id;
        this.ride = ride;
        this.rider = rider;
        this.status = status;
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

    public User getRider() {
        return rider;
    }

    public void setRider(User rider) {
        this.rider = rider;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }
}