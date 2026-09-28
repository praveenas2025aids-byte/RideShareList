package com.example.ridesharelist.repository;

import com.example.ridesharelist.entity.RideHistory;
import com.example.ridesharelist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RideHistoryRepository extends JpaRepository<RideHistory, Long> {

    List<RideHistory> findByUser(User user);
}