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

        String dbUsername = dotenv.get("DB_USERNAME");
        String dbPassword = dotenv.get("DB_PASSWORD");
        String jwtSecret = dotenv.get("JWT_SECRET");

        // ✅ Fail fast if any variable is missing
        if (dbUsername == null || dbPassword == null || jwtSecret == null) {
            throw new IllegalStateException("Missing environment variables. Please make sure DB_USERNAME, DB_PASSWORD, and JWT_SECRET are set in .env file.");
        }

        System.setProperty("spring.datasource.username", dbUsername);
        System.setProperty("spring.datasource.password", dbPassword);
        System.setProperty("jwt.secret", jwtSecret);


        SpringApplication.run(BackendApplication.class, args);
    }

}
