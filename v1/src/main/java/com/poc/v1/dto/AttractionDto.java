package com.poc.v1.dto;

import lombok.Data;

@Data
public class AttractionDto {
    private String name;
    private String category;
    private String description;
    private String distance;
    private String openingTime;
    private String travelTips;
    private Double latitude;
    private Double longitude;
}
