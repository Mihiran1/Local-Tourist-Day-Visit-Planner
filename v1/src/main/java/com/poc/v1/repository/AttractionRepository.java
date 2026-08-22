package com.poc.v1.repository;

import com.poc.v1.entity.Attraction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttractionRepository extends JpaRepository<Attraction, Long> {

    List<Attraction> findByCategory(String category);
    List<Attraction> findByNameContainingIgnoreCase(String name);
}
