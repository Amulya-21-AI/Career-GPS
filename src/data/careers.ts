import { careers1 } from "./careers-part1";
import { careers2 } from "./careers-part2";
import { careers3 } from "./careers-part3";
import { careers4 } from "./careers-part4";
import { careers5 } from "./careers-part5";
import { careers6 } from "./careers-part6";
import type { Career } from "@/types";

export const careers: Career[] = [
  ...careers1,
  ...careers2,
  ...careers3,
  ...careers4,
  ...careers5,
  ...careers6,
];

export const getCareerById = (id: string): Career | undefined =>
  careers.find((c) => c.id === id);

export const getCareersByCategory = (category: string): Career[] =>
  careers.filter((c) => c.category === category);

export const getCareersByType = (type: Career["type"]): Career[] =>
  careers.filter((c) => c.type === type);

export const careerCategories = [...new Set(careers.map((c) => c.category))];
