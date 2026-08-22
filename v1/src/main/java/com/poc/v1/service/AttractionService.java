package com.poc.v1.service;

import com.poc.v1.dto.AttractionDto;
import com.poc.v1.entity.Attraction;
import com.poc.v1.repository.AttractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttractionService {

    private final AttractionRepository attractionRepository;
    private final String UPLOAD_DIR = "uploads/attractions/";

    public Attraction addAttraction(AttractionDto dto, MultipartFile imageFile) throws IOException {
        String imageUrl = null;

        if (imageFile != null && !imageFile.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(imageFile.getInputStream(), filePath);
            imageUrl = filePath.toString();
        }

        Attraction attraction = Attraction.builder()
                .name(dto.getName())
                .category(dto.getCategory())
                .description(dto.getDescription())
                .distance(dto.getDistance())
                .openingTime(dto.getOpeningTime())
                .travelTips(dto.getTravelTips())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .imageUrl(imageUrl)
                .build();

        return attractionRepository.save(attraction);
    }
}
