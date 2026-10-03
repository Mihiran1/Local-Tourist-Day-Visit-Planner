package com.poc.v1.service;

import com.poc.v1.dto.VisitPlanRequestDto;
import com.poc.v1.entity.VisitPlan;

import java.util.List;

public interface VisitPlanService {
    VisitPlan createVisitPlan(String userEmail, VisitPlanRequestDto requestDto);
    List<VisitPlan> getUserVisitPlans(String userEmail);
    void deleteVisitPlan(Long planId, String userEmail);
    VisitPlan updateVisitPlan(Long planId, String userEmail, VisitPlanRequestDto requestDto);
}
