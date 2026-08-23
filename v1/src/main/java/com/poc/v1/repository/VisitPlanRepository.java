package com.poc.v1.repository;

import com.poc.v1.entity.User;
import com.poc.v1.entity.VisitPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisitPlanRepository extends JpaRepository<VisitPlan, Long> {
    List<VisitPlan> findByUser(User user);
}
