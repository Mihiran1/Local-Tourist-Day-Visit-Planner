package com.poc.v1.service.Impl;

import com.poc.v1.dto.VisitPlanItemRequestDto;
import com.poc.v1.dto.VisitPlanRequestDto;
import com.poc.v1.entity.Attraction;
import com.poc.v1.entity.User;
import com.poc.v1.entity.VisitPlan;
import com.poc.v1.entity.VisitPlanItem;
import com.poc.v1.exception.ResourceNotFoundException;
import com.poc.v1.repository.AttractionRepository;
import com.poc.v1.repository.UserRepository;
import com.poc.v1.repository.VisitPlanRepository;
import com.poc.v1.service.VisitPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VisitPlanServiceImpl implements VisitPlanService {

    private final VisitPlanRepository visitPlanRepository;
    private final UserRepository userRepository;
    private final AttractionRepository attractionRepository;

    @Override
    public VisitPlan createVisitPlan(String userEmail, VisitPlanRequestDto requestDto) {
        // ලොග් වෙලා ඉන්න User ව Database එකෙන් හොයාගන්නවා
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // අලුත් Visit Plan එකක් හදනවා (හැබැයි තාම සේව් කරන්නේ නෑ)
        VisitPlan plan = VisitPlan.builder()
                .user(user)
                .name(requestDto.getName())
                .tripDate(requestDto.getTripDate())
                .items(new ArrayList<>())
                .build();

        // Frontend එකෙන් එවපු අයිටම්ස් ටික (තෝරගත්ත තැන් ටික) එකින් එක අරන් අර Plan එකට දානවා
        for (VisitPlanItemRequestDto itemDto : requestDto.getItems()) {
            
            // එවපු ID එකට අදාළ ඇත්ත Attraction එක හොයාගන්නවා
            Attraction attraction = attractionRepository.findById(itemDto.getAttractionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Attraction not found"));

            // අලුත් Item එකක් (පේළියක්) හදනවා
            VisitPlanItem item = VisitPlanItem.builder()
                    .visitPlan(plan)
                    .attraction(attraction)
                    .visitOrder(itemDto.getVisitOrder())
                    .build();

            // ඒ Item එක අර ප්‍රධාන Plan එක ඇතුලට දානවා
            plan.getItems().add(item);
        }

        // අන්තිමට ඒ ප්‍රධාන Plan එක Database එකට Save කරනවා
        // අර CascadeType.ALL දාලා තියෙන නිසා ඇතුලේ තියෙන Items ඔක්කොමත් Auto සේව් වෙනවා!
        return visitPlanRepository.save(plan);
    }

    @Override
    public List<VisitPlan> getUserVisitPlans(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                
        return visitPlanRepository.findByUser(user);
    }

    @Override
    public void deleteVisitPlan(Long planId, String userEmail) {
        VisitPlan plan = visitPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
        
        if (!plan.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        
        visitPlanRepository.delete(plan);
    }

    @Override
    public VisitPlan updateVisitPlan(Long planId, String userEmail, VisitPlanRequestDto requestDto) {
        VisitPlan plan = visitPlanRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));
                
        if (!plan.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized");
        }
        
        plan.setName(requestDto.getName());
        plan.setTripDate(requestDto.getTripDate());
        
        // Clear existing items
        plan.getItems().clear();
        
        // Add new items
        for (VisitPlanItemRequestDto itemDto : requestDto.getItems()) {
            Attraction attraction = attractionRepository.findById(itemDto.getAttractionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Attraction not found"));

            VisitPlanItem item = VisitPlanItem.builder()
                    .visitPlan(plan)
                    .attraction(attraction)
                    .visitOrder(itemDto.getVisitOrder())
                    .build();

            plan.getItems().add(item);
        }
        
        return visitPlanRepository.save(plan);
    }
}
