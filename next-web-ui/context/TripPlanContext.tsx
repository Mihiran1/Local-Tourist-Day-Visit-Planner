"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface PlanItem {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}

interface TripPlanContextType {
  planItems: PlanItem[];
  addToPlan: (item: PlanItem) => void;
  removeFromPlan: (id: number) => void;
  moveItemUp: (index: number) => void;
  moveItemDown: (index: number) => void;
  clearPlan: () => void;
}

const TripPlanContext = createContext<TripPlanContextType | undefined>(undefined);

export const TripPlanProvider = ({ children }: { children: ReactNode }) => {
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tripPlan');
    if (saved) {
      try { setPlanItems(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // Save to local storage when items change
  useEffect(() => {
    localStorage.setItem('tripPlan', JSON.stringify(planItems));
  }, [planItems]);

  const addToPlan = (item: PlanItem) => {
    setPlanItems(prev => {
      if (prev.find(i => i.id === item.id)) {
        alert("This place is already in your plan!");
        return prev;
      }
      alert(`${item.name} added to your plan!`);
      return [...prev, item];
    });
  };

  const removeFromPlan = (id: number) => {
    setPlanItems(prev => prev.filter(item => item.id !== id));
  };

  const moveItemUp = (index: number) => {
    if (index === 0) return;
    setPlanItems(prev => {
      const newItems = [...prev];
      [newItems[index - 1], newItems[index]] = [newItems[index], newItems[index - 1]];
      return newItems;
    });
  };

  const moveItemDown = (index: number) => {
    if (index === planItems.length - 1) return;
    setPlanItems(prev => {
      const newItems = [...prev];
      [newItems[index + 1], newItems[index]] = [newItems[index], newItems[index + 1]];
      return newItems;
    });
  };

  const clearPlan = () => setPlanItems([]);

  return (
    <TripPlanContext.Provider value={{ planItems, addToPlan, removeFromPlan, moveItemUp, moveItemDown, clearPlan }}>
      {children}
    </TripPlanContext.Provider>
  );
};

export const useTripPlan = () => {
  const context = useContext(TripPlanContext);
  if (!context) throw new Error("useTripPlan must be used within TripPlanProvider");
  return context;
};
