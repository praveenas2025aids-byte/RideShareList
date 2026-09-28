package com.example.ridesharelist.repository;

import com.example.ridesharelist.entity.Notification;
import com.example.ridesharelist.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUser(User user);

    List<Notification> findByUserAndIsReadFalse(User user);
}