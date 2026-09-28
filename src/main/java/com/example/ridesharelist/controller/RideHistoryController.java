package com.example.ridesharelist.controller;

import com.example.ridesharelist.entity.RideHistory;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.service.RideHistoryService;
import com.example.ridesharelist.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ride-history")
public class RideHistoryController {

    private final RideHistoryService rideHistoryService;
    private final UserService userService;

    public RideHistoryController(RideHistoryService rideHistoryService,
                                 UserService userService) {
        this.rideHistoryService = rideHistoryService;
        this.userService = userService;
    }

    @GetMapping("/user/{userId}")
    public List<RideHistory> getUserHistory(
            @PathVariable Long userId) {

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return rideHistoryService.getUserHistory(user);
    }

    @GetMapping
    public List<RideHistory> getAllHistory() {
        return rideHistoryService.getAllHistory();
    }
}