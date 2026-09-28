package com.example.ridesharelist.dto;

import java.time.LocalDateTime;

public class RideOfferRequest {

    private Long driverId;
    private String origin;
    private String destination;
    private LocalDateTime departureTime;
    private int availableSeats;

    public RideOfferRequest() {
    }

    public RideOfferRequest(Long driverId, String origin,
                            String destination,
                            LocalDateTime departureTime,
                            int availableSeats) {
        this.driverId = driverId;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.availableSeats = availableSeats;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
}