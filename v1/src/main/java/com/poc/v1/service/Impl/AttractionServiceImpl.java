package com.poc.v1.service.Impl;

import com.poc.v1.dto.AttractionDto;
import com.poc.v1.entity.Attraction;
import com.poc.v1.exception.ResourceNotFoundException;
import com.poc.v1.repository.AttractionRepository;
import com.poc.v1.service.AttractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttractionServiceImpl implements AttractionService {

    private final AttractionRepository attractionRepository;

    // පින්තූර සේව් වෙන ෆෝල්ඩරය (මෙය Project එක තියෙන තැන හැදෙයි)
    private final String UPLOAD_DIR = "uploads/attractions/";

    @Override
    public Attraction addAttraction(AttractionDto dto, List<MultipartFile> imageFiles) throws IOException {
        Attraction attraction = Attraction.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .distance(dto.getDistance())
                .openingTime(dto.getOpeningTime())
                .travelTips(dto.getTravelTips())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .imageUrls(new ArrayList<>())
                .build();
        // පින්තූර ටික සේව් කිරීම
        if (imageFiles != null && !imageFiles.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            for (MultipartFile file : imageFiles) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath);
                    attraction.getImageUrls().add("/uploads/attractions/" + fileName);
                }
            }
        }
        return attractionRepository.save(attraction);
    }
    @Override
    public List<Attraction> getAllAttractions(String category, String search) {
        if (category != null && !category.isEmpty()) {
            return attractionRepository.findByCategory(category);
        }
        if (search != null && !search.isEmpty()) {
            return attractionRepository.findByNameContainingIgnoreCase(search);
        }
        return attractionRepository.findAll();
    }

    @Override
    public Attraction getAttractionById(Long id) {
        return attractionRepository.findById(id)
        .orElseThrow(() -> new com.poc.v1.exception.ResourceNotFoundException("Attraction not found with id: " + id));
    }

    @Override
    public Attraction updateAttraction(Long id, AttractionDto dto, List<MultipartFile> imageFiles) throws IOException {
        Attraction existing = attractionRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Attraction not found with id " + id));

        existing.setName(dto.getName());
        existing.setDescription(dto.getDescription());
        existing.setCategory(dto.getCategory());
        existing.setDistance(dto.getDistance());
        existing.setOpeningTime(dto.getOpeningTime());
        existing.setTravelTips(dto.getTravelTips());
        existing.setLatitude(dto.getLatitude());
        existing.setLongitude(dto.getLongitude());
    
        if (imageFiles != null && !imageFiles.isEmpty()) {
            existing.getImageUrls().clear();
            
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            for (MultipartFile file : imageFiles) {
                if (!file.isEmpty()) {
                    String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                    Path filePath = uploadPath.resolve(fileName);
                    Files.copy(file.getInputStream(), filePath);
                    existing.getImageUrls().add("/uploads/attractions/" + fileName);
                }
            }
        }
        return attractionRepository.save(existing);
    }

    @Override
    public void deleteAttraction(Long id) {
        if (!attractionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Attraction not found with id " + id);
        }
        attractionRepository.deleteById(id);
    }

}
