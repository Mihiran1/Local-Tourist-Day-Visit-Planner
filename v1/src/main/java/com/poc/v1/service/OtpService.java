package com.poc.v1.service;

import com.poc.v1.entity.OtpToken;
import com.poc.v1.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpTokenRepository otpTokenRepository;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void generateAndSendOtp(String email) {
        // Generate a 6-digit OTP
        String otpCode = String.format("%06d", secureRandom.nextInt(1000000));
        LocalDateTime expiresAt = LocalDateTime.now().plusMinutes(10);

        // Find existing OTP token or create a new one to avoid Hibernate Insert-Before-Delete unique constraint errors
        OtpToken otpToken = otpTokenRepository.findByEmail(email).orElse(new OtpToken());
        otpToken.setEmail(email);
        otpToken.setOtpCode(otpCode);
        otpToken.setExpiresAt(expiresAt);
        
        otpTokenRepository.save(otpToken);

        // 4. Send Email
        emailService.sendOtpEmail(email, otpCode);
    }
}
