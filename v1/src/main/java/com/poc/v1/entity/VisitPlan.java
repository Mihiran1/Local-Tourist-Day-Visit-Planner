package com.poc.v1.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "visit_plans")
public class VisitPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false )
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(name = "trip_date")
    private LocalDate tripDate;

    @OneToMany(mappedBy = "visitPlan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VisitPlanItem> items;
}