package com.pillpath.backend.controller;

import com.pillpath.backend.dto.JwtResponse;
import com.pillpath.backend.dto.LoginRequest;
import com.pillpath.backend.dto.RegisterRequest;
import com.pillpath.backend.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;


@RestController
@RequestMapping("/api/auth")

public class AuthController {
    private final CustomerService customerService;

    public AuthController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            String result = customerService.registerCustomer(registerRequest);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // show error to frontend
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            String jwt = customerService.loginCustomer(loginRequest);
            return ResponseEntity.ok(new JwtResponse(jwt));
        } catch (RuntimeException e) {
            // 401 is more appropriate for failed authentication
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    
}

