package com.pillpath.backend.repository;
import com.pillpath.backend.entity.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);

    boolean existsByEmail(String email);
}

// This interface extends JpaRepository to provide CRUD operations for Customer entity.