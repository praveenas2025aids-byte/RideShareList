package com.example.ridesharelist.service;

import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.entity.Role;
import com.example.ridesharelist.exception.BusinessException;
import com.example.ridesharelist.exception.ResourceNotFoundException;
import com.example.ridesharelist.repository.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getRiders() {
        return userRepository.findByRole(Role.RIDER);
    }

    public User updateUser(Long id, User changes) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(changes.getName());
        user.setEmail(changes.getEmail());
        user.setPhoneNumber(changes.getPhoneNumber());
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }

        try {
            userRepository.deleteById(id);
        } catch (DataIntegrityViolationException exception) {
            throw new BusinessException(
                    "Profile cannot be deleted while it is linked to rides, requests, history, or notifications");
        }
    }
}