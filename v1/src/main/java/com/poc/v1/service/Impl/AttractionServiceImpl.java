package com.poc.v1.service.Impl;

import com.poc.v1.dto.AttractionDto;
import com.poc.v1.entity.Attraction;
import com.poc.v1.repository.AttractionRepository;
import com.poc.v1.service.AttractionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AttractionServiceImpl implements AttractionService {

    private final AttractionRepository attractionRepository;

    // පින්තූර සේව් වෙන ෆෝල්ඩරය (මෙය Project එක තියෙන තැන හැදෙයි)
    private final String UPLOAD_DIR = "uploads/attractions/";

    @Override
    public Attraction addAttraction(AttractionDto dto, MultipartFile imageFile) throws IOException {
        String imageUrl = null;

        // පින්තූරයක් එවලා තියෙනවා නම් ඒක සේව් කරන්න ඕනේ
        if (imageFile != null && !imageFile.isEmpty()) {
            Path uploadPath = Paths.get(UPLOAD_DIR);

            // ෆෝල්ඩරය නැත්නම් අලුතින් හදනවා
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // එකම නම තියෙන පින්තූර 2ක් ආවොත් ප්‍රශ්න වෙන නිසා අලුත් නමක් හදනවා (UUID)
            String fileName = UUID.randomUUID().toString() + "_" + imageFile.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);

            // පින්තූරය Hard disk එකට සේව් කරනවා
            Files.copy(imageFile.getInputStream(), filePath);

            // Database එකට දාන්න URL එක හදාගන්නවා
            imageUrl = "/uploads/attractions/" + fileName;
        }

        // Entity එක හදලා Database එකට සේව් කරනවා
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

}
