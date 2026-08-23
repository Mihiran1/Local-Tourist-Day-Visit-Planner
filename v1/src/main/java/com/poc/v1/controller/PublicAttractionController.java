package com.poc.v1.controller;

import com.poc.v1.entity.Attraction;
import com.poc.v1.service.Impl.AttractionServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class PublicAttractionController {

    private final AttractionServiceImpl attractionService;

    @GetMapping
    public ResponseEntity<List<Attraction>> getAllAttractions(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String search
    ) {
            return ResponseEntity.ok(attractionService.getAllAttractions(category, search));
        }

    @GetMapping("/{id}")
    public ResponseEntity<Attraction> getAttractionById(@PathVariable Long id) {
        return ResponseEntity.ok(attractionService.getAttractionById(id));
    }

}