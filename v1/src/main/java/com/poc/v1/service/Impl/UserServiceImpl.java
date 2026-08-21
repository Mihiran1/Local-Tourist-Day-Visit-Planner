package com.poc.v1.service.Impl;

import com.poc.v1.dto.SignupRequest;
import com.poc.v1.dto.UserResponse;
import com.poc.v1.entity.Role;
import com.poc.v1.entity.User;
import com.poc.v1.exception.EmailAlreadyExistsException;
import com.poc.v1.repository.UserRepository;
import com.poc.v1.service.OtpService;
import com.poc.v1.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.poc.v1.dto.LoginResponse;
import com.poc.v1.security.JwtService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final OtpService otpService;
    private final com.poc.v1.repository.OtpTokenRepository otpTokenRepository;

    @Override
    @Transactional
    public UserResponse registerUser(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email already registered: " + request.getEmail());
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        user.setEnabled(false); // User must verify OTP before logging in

        User savedUser = userRepository.save(user);

        // Generate and send OTP via Email
        otpService.generateAndSendOtp(savedUser.getEmail());

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getPhone(),
                savedUser.getEmail()
        );
    }

    @Override
    public LoginResponse login(com.poc.v1.dto.LoginRequest request) {
        // This will automatically check password and if user is enabled via CustomUserDetailsService
        authenticationManager.authenticate(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.poc.v1.exception.InvalidCredentialsException("Invalid email or password"));

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new com.poc.v1.dto.LoginResponse(token, user.getEmail(), user.getRole().name());
    }

    @Override
    @Transactional
    public void verifyOtp(com.poc.v1.dto.VerifyOtpRequest request) {
        // Find user
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.poc.v1.exception.ApplicationException(
                        "User not found", org.springframework.http.HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));

        if (user.isEnabled()) {
            throw new com.poc.v1.exception.ApplicationException(
                    "User is already verified", org.springframework.http.HttpStatus.BAD_REQUEST, "USER_ALREADY_VERIFIED");
        }

        // Find OTP token
        com.poc.v1.entity.OtpToken otpToken = otpTokenRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.poc.v1.exception.ApplicationException(
                        "No OTP found for this email", org.springframework.http.HttpStatus.BAD_REQUEST, "OTP_NOT_FOUND"));

        // Check if OTP matches
        if (!otpToken.getOtpCode().equals(request.getOtpCode())) {
            throw new com.poc.v1.exception.ApplicationException(
                    "Invalid OTP code", org.springframework.http.HttpStatus.BAD_REQUEST, "INVALID_OTP");
        }

        // Check if OTP is expired
        if (otpToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new com.poc.v1.exception.ApplicationException(
                    "OTP has expired. Please request a new one.", org.springframework.http.HttpStatus.BAD_REQUEST, "OTP_EXPIRED");
        }

        // OTP is valid. Enable user and delete OTP token
        user.setEnabled(true);
        userRepository.save(user);
        otpTokenRepository.delete(otpToken);
    }

        @Override
    public void forgotPassword(com.poc.v1.dto.ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.poc.v1.exception.ApplicationException(
                        "User not found with this email", org.springframework.http.HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));

        // අදාළ ඊමේල් එකට අලුත් OTP එකක් යවනවා
        otpService.generateAndSendOtp(user.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(com.poc.v1.dto.ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.poc.v1.exception.ApplicationException(
                        "User not found", org.springframework.http.HttpStatus.NOT_FOUND, "USER_NOT_FOUND"));

        com.poc.v1.entity.OtpToken otpToken = otpTokenRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new com.poc.v1.exception.ApplicationException(
                        "No OTP found for this email", org.springframework.http.HttpStatus.BAD_REQUEST, "OTP_NOT_FOUND"));

        if (!otpToken.getOtpCode().equals(request.getOtpCode())) {
            throw new com.poc.v1.exception.ApplicationException(
                    "Invalid OTP code", org.springframework.http.HttpStatus.BAD_REQUEST, "INVALID_OTP");
        }

        if (otpToken.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            throw new com.poc.v1.exception.ApplicationException(
                    "OTP has expired", org.springframework.http.HttpStatus.BAD_REQUEST, "OTP_EXPIRED");
        }

        // OTP එක හරි නම්, අලුත් පාස්වර්ඩ් එක Save කරනවා
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        otpTokenRepository.delete(otpToken); // පාවිච්චි කරපු OTP එක අයින් කරනවා
    }

}
