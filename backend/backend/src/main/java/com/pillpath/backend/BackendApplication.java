package com.pillpath.backend;

import io.github.cdimascio.dotenv.Dotenv;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
        .directory("backend/backend")  // path
        .filename(".env")
        .load();

        System.setProperty("spring.datasource.username", dotenv.get("DB_USERNAME"));
        System.setProperty("spring.datasource.password", dotenv.get("DB_PASSWORD"));
        System.setProperty("jwt.secret", dotenv.get("JWT_SECRET"));

        SpringApplication.run(BackendApplication.class, args);
    }

}
