package com.poc.v1.dto;

import java.time.LocalDate;
import java.util.List;

public class VisitPlanRequestDto {
    private String name;
    private LocalDate tripDate;
    private List<VisitPlanItemRequestDto> items;
}
