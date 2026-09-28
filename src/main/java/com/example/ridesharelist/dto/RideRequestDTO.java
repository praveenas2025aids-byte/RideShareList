package com.example.ridesharelist.dto;

public class RideRequestDTO {

    private Long rideId;
    private Long riderId;

    public RideRequestDTO() {
    }

    public RideRequestDTO(Long rideId, Long riderId) {
        this.rideId = rideId;
        this.riderId = riderId;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public Long getRiderId() {
        return riderId;
    }

    public void setRiderId(Long riderId) {
        this.riderId = riderId;
    }
}