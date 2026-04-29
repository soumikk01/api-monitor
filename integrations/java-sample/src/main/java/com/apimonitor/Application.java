package com.apimonitor;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
        System.out.println("\n☕ Java Spring Boot Backend running on http://localhost:8080");
        System.out.println("📡 Monitoring → http://localhost:4000/api/v1/ingest");
        System.out.println("📖 Docs       → http://localhost:8080/api/v1/ping\n");
    }
}
