package com.pillpath.backend.service;

import com.pillpath.backend.dto.LoginRequest;
import com.pillpath.backend.dto.RegisterRequest;
import com.pillpath.backend.entity.Customer;
import com.pillpath.backend.repository.CustomerRepository;
import com.pillpath.backend.security.JwtUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public CustomerService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public String registerCustomer(RegisterRequest request) {
        try {
            if (customerRepository.existsByEmail(request.getEmail())) {
                return "Email is already registered";
            }

            if (!request.getPassword().equals(request.getConfirmPassword())) {
                return "Password and Confirm Password do not match";
            }

            Customer customer = Customer.builder()
                    .firstName(request.getFirstName())
                    .lastName(request.getLastName())
                    .email(request.getEmail())
                    .phoneNumber(request.getPhoneNumber())
                    .dateOfBirth(request.getDateOfBirth())
                    .password(passwordEncoder.encode(request.getPassword())) // hash password
                    .build();

            customerRepository.save(customer);
            return "Customer registered successfully";
        } catch (Exception e) {
            // Log exception if needed
            return "Registration failed: " + e.getMessage();
        }
    }

    public String loginCustomer(LoginRequest request) {
        try {
            Optional<Customer> customerOpt = customerRepository.findByEmail(request.getEmail());

            if (customerOpt.isEmpty()) {
                return "Invalid email or password";
            }

            Customer customer = customerOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
                return "Invalid email or password";
            }

            return jwtUtils.generateJwtToken(customer.getEmail());
        } catch (Exception e) {
            // Log exception if needed
            return "Login failed: " + e.getMessage();
        }
    }
}
