package com.example.ridesharelist.service;

import com.example.ridesharelist.entity.RideOffer;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.repository.RideOfferRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RideOfferService {

    private final RideOfferRepository rideOfferRepository;

    public RideOfferService(RideOfferRepository rideOfferRepository) {
        this.rideOfferRepository = rideOfferRepository;
    }

    public RideOffer createRide(RideOffer rideOffer) {
        return rideOfferRepository.save(rideOffer);
    }

    public List<RideOffer> getAllRides() {
        return rideOfferRepository.findAll();
    }

    public Optional<RideOffer> getRideById(Long id) {
        return rideOfferRepository.findById(id);
    }

    public List<RideOffer> getRidesByDriver(User driver) {
        return rideOfferRepository.findByDriver(driver);
    }

    public List<RideOffer> searchRides(String origin, String destination) {
        return rideOfferRepository.findByOriginAndDestination(origin, destination);
    }

    public void deleteRide(Long id) {
        rideOfferRepository.deleteById(id);
    }
}