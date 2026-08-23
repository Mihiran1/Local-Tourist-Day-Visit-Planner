package com.poc.v1.controller;

import com.poc.v1.dto.AttractionDto;
import com.poc.v1.entity.Attraction;
import com.poc.v1.service.AttractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/attractions")
@RequiredArgsConstructor
public class AdminAttractionController {

    private final AttractionService attractionService;

    // 1. අලුතින් එකතු කිරීම (Create)
    @PostMapping
    public ResponseEntity<Attraction> addAttraction(
            @ModelAttribute AttractionDto attractionDto,
            // මෙතන නම "images" කියලා වෙනස් කරා (මොකද දැන් ගොඩක් එන නිසා)
            @RequestParam(value = "images", required = false) List<MultipartFile> imageFiles 
    ) throws IOException {
        Attraction savedAttraction = attractionService.addAttraction(attractionDto, imageFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAttraction);
    }

    // 2. වෙනස් කිරීම (Update)
    @PutMapping("/{id}")
    public ResponseEntity<Attraction> updateAttraction(
            @PathVariable Long id,
            @ModelAttribute AttractionDto dto,
            @RequestParam(value = "images", required = false) List<MultipartFile> imageFiles
    ) {
        try {
            Attraction updated = attractionService.updateAttraction(id, dto, imageFiles);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // 3. මැකීම (Delete)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttraction(@PathVariable Long id) {
        attractionService.deleteAttraction(id);
        return ResponseEntity.noContent().build();
    }
}
