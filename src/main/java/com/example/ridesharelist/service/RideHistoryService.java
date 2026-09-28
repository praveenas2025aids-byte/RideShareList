package com.example.ridesharelist.service;

import com.example.ridesharelist.entity.RideHistory;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.repository.RideHistoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RideHistoryService {

    private final RideHistoryRepository rideHistoryRepository;

    public RideHistoryService(RideHistoryRepository rideHistoryRepository) {
        this.rideHistoryRepository = rideHistoryRepository;
    }

    public RideHistory saveHistory(RideHistory rideHistory) {
        return rideHistoryRepository.save(rideHistory);
    }

    public List<RideHistory> getUserHistory(User user) {
        return rideHistoryRepository.findByUser(user);
    }

    public List<RideHistory> getAllHistory() {
        return rideHistoryRepository.findAll();
    }
}