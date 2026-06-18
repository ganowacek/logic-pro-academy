"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type Store = {
  completedLessons: string[];
  projectParts: string[];
  xp: number;
  completeLesson: (id: string, part?: string) => void;
  reset: () => void;
};

export const useAcademy = create<Store>()(persist((set) => ({
  completedLessons: [],
  projectParts: [],
  xp: 120,
  completeLesson: (id, part) => set((state) => ({
    completedLessons: state.completedLessons.includes(id) ? state.completedLessons : [...state.completedLessons, id],
    projectParts: part && !state.projectParts.includes(part) ? [...state.projectParts, part] : state.projectParts,
    xp: state.completedLessons.includes(id) ? state.xp : state.xp + 40
  })),
  reset: () => set({ completedLessons: [], projectParts: [], xp: 120 })
}), { name: "logic-pro-academy-progress" }));
