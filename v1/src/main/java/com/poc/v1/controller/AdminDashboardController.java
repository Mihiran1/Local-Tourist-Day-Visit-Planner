package com.poc.v1.controller;

import com.poc.v1.dto.DashboardStatsDto;
import com.poc.v1.repository.AttractionRepository;
import com.poc.v1.repository.UserRepository;
import com.poc.v1.repository.VisitPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final AttractionRepository attractionRepository;
    private final UserRepository userRepository;
    private final VisitPlanRepository visitPlanRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats() {
        DashboardStatsDto stats = new DashboardStatsDto();

        stats.setTotalAttractions(attractionRepository.count());
        stats.setTotalUsers(userRepository.count());
        stats.setTotalVisitPlans(visitPlanRepository.count());
        return ResponseEntity.ok(stats);
    }
}
