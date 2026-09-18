package com.example.notes.controller;

import com.example.notes.model.User;
import com.example.notes.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @RequestBody AuthRequest request) {

        User user = userService.register(
                request.getUsername(),
                request.getPassword()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new UserResponse(
                        user.getUserId(),
                        user.getUsername()
                ));
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(
            @RequestBody AuthRequest request,
            HttpSession session) {

        User user = userService.login(
                request.getUsername(),
                request.getPassword()
        );

        // Store logged-in user's ID in the session
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("username", user.getUsername());

        return ResponseEntity.ok(
                new UserResponse(
                        user.getUserId(),
                        user.getUsername()
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> currentUser(
            HttpSession session) {

        Object userId = session.getAttribute("userId");
        Object username = session.getAttribute("username");

        if (userId == null || username == null) {
            return ResponseEntity.status(
                    HttpStatus.UNAUTHORIZED
            ).build();
        }

        return ResponseEntity.ok(
                new UserResponse(
                        (Integer) userId,
                        (String) username
                )
        );
    }

    public static class AuthRequest {

        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class UserResponse {

        private Integer userId;
        private String username;

        public UserResponse(
                Integer userId,
                String username) {

            this.userId = userId;
            this.username = username;
        }

        public Integer getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }
    }
}