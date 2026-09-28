package com.example.ridesharelist.controller;

import com.example.ridesharelist.dto.LoginRequest;
import com.example.ridesharelist.entity.User;
import com.example.ridesharelist.exception.BusinessException;
import com.example.ridesharelist.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public User loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest.getEmail())
                .filter(user -> user.getPassword().equals(loginRequest.getPassword()))
                .orElseThrow(() -> new BusinessException("Invalid email or password"));
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User changes) {
        return userService.updateUser(id, changes);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return "Profile deleted successfully";
    }

    @GetMapping("/riders")
    public List<User> getRiders() {
        return userService.getRiders();
    }

    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }
}