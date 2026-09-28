package com.example.ridesharelist.service;

import com.example.ridesharelist.entity.RequestStatus;
import com.example.ridesharelist.entity.RideOffer;
import com.example.ridesharelist.entity.RideRequest;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.exception.BusinessException;
import com.example.ridesharelist.exception.ResourceNotFoundException;
import com.example.ridesharelist.repository.RideOfferRepository;
import com.example.ridesharelist.repository.RideRequestRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideRequestService {

    private final RideRequestRepository rideRequestRepository;
    private final RideOfferRepository rideOfferRepository;

    public RideRequestService(RideRequestRepository rideRequestRepository,
                              RideOfferRepository rideOfferRepository) {
        this.rideRequestRepository = rideRequestRepository;
        this.rideOfferRepository = rideOfferRepository;
    }

    public RideRequest createRequest(Long rideId, User rider) {

        RideOffer ride = rideOfferRepository.findById(rideId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ride not found"));

        if (ride.getDriver().getId().equals(rider.getId())) {
            throw new BusinessException(
                    "Driver cannot request a seat on their own ride");
        }

        if (ride.getAvailableSeats() <= 0) {
            throw new BusinessException("No seats available");
        }

        RideRequest request = new RideRequest();
        request.setRide(ride);
        request.setRider(rider);
        request.setStatus(RequestStatus.PENDING);

        return rideRequestRepository.save(request);
    }

    public List<RideRequest> getRequestsForRide(RideOffer ride) {
        return rideRequestRepository.findByRide(ride);
    }

    public List<RideRequest> getRequestsByRider(User rider) {
        return rideRequestRepository.findByRider(rider);
    }

    public RideRequest approveRequest(Long requestId) {

        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ride request not found"));

        RideOffer ride = request.getRide();

        requirePending(request);

        if (ride.getAvailableSeats() <= 0) {
            throw new BusinessException("No seats available");
        }

        request.setStatus(RequestStatus.APPROVED);

        ride.setAvailableSeats(ride.getAvailableSeats() - 1);

        rideOfferRepository.save(ride);

        return rideRequestRepository.save(request);
    }

    public RideRequest rejectRequest(Long requestId) {

        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ride request not found"));

        requirePending(request);
        request.setStatus(RequestStatus.REJECTED);

        return rideRequestRepository.save(request);
    }

    public RideRequest cancelRequest(Long requestId, Long riderId) {
        RideRequest request = rideRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Ride request not found"));

        if (!request.getRider().getId().equals(riderId)) {
            throw new BusinessException("You can only cancel your own ride requests");
        }

        requirePending(request);
        request.setStatus(RequestStatus.CANCELLED);
        return rideRequestRepository.save(request);
    }

    private void requirePending(RideRequest request) {
        if (request.getStatus() != RequestStatus.PENDING) {
            throw new BusinessException("Only pending requests can be changed");
        }
    }
}