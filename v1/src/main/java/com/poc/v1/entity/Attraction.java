package com.poc.v1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

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

    @Column(columnDefinition = "TEXT")
    private String description;

    private String distance; // උදා: "20km"

    private String openingTime;

    @Column(columnDefinition = "TEXT")
    private String travelTips;

    // Map එකේ පෙන්වන්න ඛණ්ඩාංක (Coordinates)
    private Double latitude;
    private Double longitude;

    @ElementCollection
    @CollectionTable(name = "attraction_images", joinColumns = @JoinColumn(name = "attraction_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "attraction", cascade = CascadeType.REMOVE)
    private List<VisitPlanItem> visitPlanItems = new ArrayList<>();
}
