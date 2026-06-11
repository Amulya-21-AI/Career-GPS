import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function scoreColor(score: number): string {
  if (score >= 75) return "text-emerald-600";
  if (score >= 55) return "text-amber-600";
  return "text-rose-500";
}

export function scoreBg(score: number): string {
  if (score >= 75) return "bg-emerald-100 text-emerald-800";
  if (score >= 55) return "bg-amber-100 text-amber-800";
  return "bg-rose-100 text-rose-700";
}

export function difficultyLabel(score: number): string {
  if (score <= 3) return "Beginner-friendly";
  if (score <= 5) return "Moderate";
  if (score <= 7) return "Challenging";
  return "Expert-level";
}

export function riskLabel(score: number): string {
  if (score <= 2) return "Very Stable";
  if (score <= 4) return "Stable";
  if (score <= 6) return "Moderate Risk";
  return "High Risk";
}

export function demandLabel(score: number): string {
  if (score >= 9) return "Very High Demand";
  if (score >= 7) return "High Demand";
  if (score >= 5) return "Moderate Demand";
  return "Niche Market";
}

export function typeLabel(type: string): string {
  const map: Record<string, string> = {
    conventional: "Conventional",
    unconventional: "Unconventional",
    emerging: "Emerging",
    niche: "Niche",
  };
  return map[type] || type;
}

export function typeBadgeClass(type: string): string {
  const map: Record<string, string> = {
    conventional: "bg-blue-100 text-blue-700",
    unconventional: "bg-purple-100 text-purple-700",
    emerging: "bg-emerald-100 text-emerald-700",
    niche: "bg-orange-100 text-orange-700",
  };
  return map[type] || "bg-gray-100 text-gray-700";
}
