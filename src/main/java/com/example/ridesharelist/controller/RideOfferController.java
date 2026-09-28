package com.example.ridesharelist.controller;

import com.example.ridesharelist.entity.RideOffer;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.service.RideOfferService;
import com.example.ridesharelist.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rides")
public class RideOfferController {

    private final RideOfferService rideOfferService;
    private final UserService userService;

    public RideOfferController(RideOfferService rideOfferService,
                               UserService userService) {
        this.rideOfferService = rideOfferService;
        this.userService = userService;
    }

    @PostMapping("/create")
    public RideOffer createRide(@RequestBody RideOffer rideOffer) {
        return rideOfferService.createRide(rideOffer);
    }

    @GetMapping
    public List<RideOffer> getAllRides() {
        return rideOfferService.getAllRides();
    }

    @GetMapping("/{id}")
    public RideOffer getRideById(@PathVariable Long id) {
        return rideOfferService.getRideById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
    }

    @GetMapping("/driver/{driverId}")
    public List<RideOffer> getRidesByDriver(@PathVariable Long driverId) {

        User driver = userService.getUserById(driverId)
                .orElseThrow(() -> new RuntimeException("Driver not found"));

        return rideOfferService.getRidesByDriver(driver);
    }

    @GetMapping("/search")
    public List<RideOffer> searchRides(
            @RequestParam String origin,
            @RequestParam String destination) {

        return rideOfferService.searchRides(origin, destination);
    }

    @DeleteMapping("/{id}")
    public String deleteRide(@PathVariable Long id) {

        rideOfferService.deleteRide(id);

        return "Ride deleted successfully";
    }
}