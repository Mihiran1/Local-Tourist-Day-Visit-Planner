package com.poc.v1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "attractions")
public class Attraction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category; // උදා: Nature, Religious, Heritage

    @Column(length = 1000)
    private String description;

    private String distance; // උදා: "20km"

    private String openingTime;

    @Column(length = 500)
    private String travelTips;

    // Map එකේ පෙන්වන්න ඛණ්ඩාංක (Coordinates)
    private Double latitude;
    private Double longitude;

    private String imageUrl; // සේව් කරන පින්තූරයේ නම/path එක
}
