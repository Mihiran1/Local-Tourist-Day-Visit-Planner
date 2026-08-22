package com.poc.v1.controller;

import com.poc.v1.dto.AttractionDto;
import com.poc.v1.entity.Attraction;
import com.poc.v1.service.Impl.AttractionServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/admin/attractions")
@RequiredArgsConstructor
public class AdminAttractionController {

    private final AttractionServiceImpl attractionService;

    @PostMapping
    public ResponseEntity<Attraction> addAttraction(
            @ModelAttribute AttractionDto attractionDto,
            @RequestParam(value = "image", required = false) MultipartFile imageFile // පින්තූරය අල්ලගන්නවා
    ) throws IOException {

        // Service එකට දත්ත ටික යවලා Save කරගන්නවා
        Attraction savedAttraction = attractionService.addAttraction(attractionDto, imageFile);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedAttraction);
    }
}
