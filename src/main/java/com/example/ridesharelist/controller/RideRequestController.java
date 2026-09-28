package com.example.ridesharelist.controller;

import com.example.ridesharelist.dto.RideRequestDTO;
import com.example.ridesharelist.entity.RideOffer;
import com.example.ridesharelist.entity.RideRequest;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.service.RideOfferService;
import com.example.ridesharelist.service.RideRequestService;
import com.example.ridesharelist.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ride-requests")
public class RideRequestController {

    private final RideRequestService rideRequestService;
    private final RideOfferService rideOfferService;
    private final UserService userService;

    public RideRequestController(RideRequestService rideRequestService,
                                 RideOfferService rideOfferService,
                                 UserService userService) {
        this.rideRequestService = rideRequestService;
        this.rideOfferService = rideOfferService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public RideRequest createRequest(@RequestBody RideRequestDTO requestDTO) {

        User rider = userService.getUserById(requestDTO.getRiderId())
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        return rideRequestService.createRequest(
                requestDTO.getRideId(),
                rider
        );
    }

    @GetMapping("/ride/{rideId}")
    public List<RideRequest> getRequestsForRide(
            @PathVariable Long rideId) {

        RideOffer ride = rideOfferService.getRideById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found"));

        return rideRequestService.getRequestsForRide(ride);
    }

    @GetMapping("/rider/{riderId}")
    public List<RideRequest> getRequestsByRider(
            @PathVariable Long riderId) {

        User rider = userService.getUserById(riderId)
                .orElseThrow(() -> new RuntimeException("Rider not found"));

        return rideRequestService.getRequestsByRider(rider);
    }

    @PutMapping("/{requestId}/approve")
    public RideRequest approveRequest(
            @PathVariable Long requestId) {

        return rideRequestService.approveRequest(requestId);
    }

    @PutMapping("/{requestId}/reject")
    public RideRequest rejectRequest(
            @PathVariable Long requestId) {

        return rideRequestService.rejectRequest(requestId);
    }

    @PutMapping("/{requestId}/cancel")
    public RideRequest cancelRequest(@PathVariable Long requestId,
                                     @RequestParam Long riderId) {
        return rideRequestService.cancelRequest(requestId, riderId);
    }
}