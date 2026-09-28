package com.example.ridesharelist.repository;

import com.example.ridesharelist.entity.RideOffer;
import com.example.ridesharelist.entity.RideRequest;
import com.example.ridesharelist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {

    List<RideRequest> findByRide(RideOffer ride);

    List<RideRequest> findByRider(User rider);
}