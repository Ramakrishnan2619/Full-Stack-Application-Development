package com.week8.User_MS;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class UserMsApplication {

    private String lastMessage = "No message received yet.";

    public static void main(String[] args) {
        SpringApplication.run(UserMsApplication.class, args);
    }

    // Task 8.5: Consume JMS Message
    @JmsListener(destination = "account-queue")
    public void receiveMessage(String message) {
        System.out.println("User-MS Received JMS Message: " + message);
        this.lastMessage = message;
    }

    @GetMapping("/api/user/status")
    public String getStatus() {
        return "User-MS is running! Last JMS Message: " + lastMessage;
    }
}
