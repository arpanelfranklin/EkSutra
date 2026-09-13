package com.example.integration_plateform.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Slf4j
@Configuration
@EnableMongoAuditing
public class MongoConfig {

    @Value("${spring.mongodb.uri:${spring.data.mongodb.uri:}}")
    private String mongoUri;

    @PostConstruct
    public void logMongoConfiguration() {
        if (mongoUri != null && !mongoUri.isBlank()) {
            String masked = mongoUri.replaceAll("://([^:]+):([^@]+)@", "://$1:****@");
            log.info("Active MongoDB connection URI: {}", masked);
        } else {
            log.warn("No MongoDB URI configured in properties, defaulting to localhost:27017");
        }
    }
}
