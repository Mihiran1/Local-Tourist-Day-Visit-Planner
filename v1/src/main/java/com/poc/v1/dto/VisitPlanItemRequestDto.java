package com.poc.v1.dto;

import lombok.Data;

@Data
public class VisitPlanItemRequestDto {
    private Long attractionId;
    private Integer visitOrder;
}
