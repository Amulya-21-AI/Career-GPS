"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProfile, GPSReport, InterestTestResult, ChatMessage } from "@/types";

interface QuizStore {
  step: number;
  totalSteps: number;
  profile: Partial<UserProfile>;
  report: GPSReport | null;
  savedCareers: string[];
  compareList: string[];
  interestTestResult: InterestTestResult | null;
  chatMessages: ChatMessage[];
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  setReport: (report: GPSReport) => void;
  resetQuiz: () => void;
  toggleSaveCareer: (careerId: string) => void;
  toggleCompare: (careerId: string) => void;
  setInterestTestResult: (result: InterestTestResult) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

const defaultProfile: Partial<UserProfile> = {
  name: "",
  ageRange: "",
  stage: undefined,
  country: "India",
  educationStream: "",
  degree: "",
  subjects: [],
  currentSkills: [],
  interests: [],
  workStyle: [],
  values: [],
  workEnvironment: "",
  riskTolerance: "medium",
  desiredIncome: "",
  timeline: "1year",
  techComfort: 5,
  peopleComfort: 5,
  creativeComfort: 5,
  analyticalComfort: 5,
  careersConsidered: [],
  careersAvoided: [],
};

export const useQuizStore = create<QuizStore>()(
  persist(
    (set, get) => ({
      step: 0,
      totalSteps: 12,
      profile: defaultProfile,
      report: null,
      savedCareers: [],
      compareList: [],
      interestTestResult: null,
      chatMessages: [],

      setStep: (step) => set({ step }),
      nextStep: () => set((s) => ({ step: Math.min(s.step + 1, s.totalSteps) })),
      prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 0) })),
      updateProfile: (updates) =>
        set((s) => ({ profile: { ...s.profile, ...updates } })),
      setReport: (report) => set({ report }),
      resetQuiz: () => set({ step: 0, profile: defaultProfile, report: null }),

      toggleSaveCareer: (careerId) =>
        set((s) => ({
          savedCareers: s.savedCareers.includes(careerId)
            ? s.savedCareers.filter((id) => id !== careerId)
            : [...s.savedCareers, careerId],
        })),

      toggleCompare: (careerId) =>
        set((s) => ({
          compareList: s.compareList.includes(careerId)
            ? s.compareList.filter((id) => id !== careerId)
            : s.compareList.length < 3
            ? [...s.compareList, careerId]
            : s.compareList,
        })),
      setInterestTestResult: (result) => set({ interestTestResult: result }),
      addChatMessage: (msg) => set((s) => ({ chatMessages: [...s.chatMessages.slice(-49), msg] })),
      clearChat: () => set({ chatMessages: [] }),
    }),
    {
      name: "career-gps-store",
      partialize: (state) => ({
        profile: state.profile,
        report: state.report,
        savedCareers: state.savedCareers,
        compareList: state.compareList,
        step: state.step,
        interestTestResult: state.interestTestResult,
        chatMessages: state.chatMessages,
      }),
    }
  )
);
