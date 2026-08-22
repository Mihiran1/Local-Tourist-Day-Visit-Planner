package com.poc.v1.service;

import com.poc.v1.dto.AttractionDto;
import com.poc.v1.entity.Attraction;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

public interface AttractionService {
    Attraction addAttraction(AttractionDto dto, MultipartFile imageFile) throws IOException;
    List<Attraction> getAllAttractions(String category, String search);

}
