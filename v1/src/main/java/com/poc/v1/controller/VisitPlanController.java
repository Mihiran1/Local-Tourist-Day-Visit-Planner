package com.poc.v1.controller;

import com.poc.v1.dto.VisitPlanRequestDto;
import com.poc.v1.entity.VisitPlan;
import com.poc.v1.service.VisitPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/plans")
@RequiredArgsConstructor
public class VisitPlanController {

    private final VisitPlanService visitPlanService;

    @PostMapping
    public ResponseEntity<VisitPlan> createPlan(
            @RequestBody VisitPlanRequestDto requestDto,
            Principal principal
    ){
        VisitPlan savedPlan = visitPlanService.createVisitPlan(principal.getName(), requestDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPlan);
    }

    @GetMapping("/my-plans")
    public ResponseEntity<List<VisitPlan>> getMyPlans(Principal principal) {
        List<VisitPlan> myPlans = visitPlanService.getUserVisitPlans(principal.getName());
        return ResponseEntity.ok(myPlans);
    }
}
