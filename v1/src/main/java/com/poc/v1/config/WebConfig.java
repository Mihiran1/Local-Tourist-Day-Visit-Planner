package com.poc.v1.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        // "uploads" ෆෝල්ඩරය කොහෙද තියෙන්නේ කියලා Spring Boot එකට හොයාගන්න දෙනවා
        Path uploadDir = Paths.get("uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();
        // යම්කිසි කෙනෙක් /uploads/... කියලා Request එකක් එව්වොත්, කෙලින්ම අපේ Hard Disk එකේ ෆෝල්ඩරේ තියෙන පින්තූරය දෙනවා
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}