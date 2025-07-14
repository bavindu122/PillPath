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
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        //check password and confirm password match
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password and Confirm Password do not match");
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
    }

            public String loginCustomer(LoginRequest request) {
                Optional<Customer> customerOpt = customerRepository.findByEmail(request.getEmail());

            if(customerOpt.isEmpty()) {
                throw new RuntimeException("Invalid email or password");
            }

            Customer customer = customerOpt.get();

            if (!passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

            return jwtUtils.generateJwtToken(customer.getEmail());
    }

    
    
}

