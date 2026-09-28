package com.example.ridesharelist.repository;

import com.example.ridesharelist.entity.RideOffer;
import com.example.ridesharelist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideOfferRepository extends JpaRepository<RideOffer, Long> {

    List<RideOffer> findByDriver(User driver);

    List<RideOffer> findByOriginAndDestination(String origin, String destination);
}