package com.poc.v1.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String to, String otpCode) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject("Your OTP Verification Code");
            message.setText("Welcome to our platform! \n\nYour verification code is: " + otpCode + 
                    "\n\nThis code will expire in 10 minutes.");
            
            mailSender.send(message);
            log.info("OTP Email sent successfully to {}", to);
        } catch (Exception e) {
            log.error("Failed to send OTP email to {}", to, e);
            // We don't throw an exception here because we don't want to roll back the user registration 
            // if the email service is temporarily down or credentials are not configured yet.
        }
    }
}
