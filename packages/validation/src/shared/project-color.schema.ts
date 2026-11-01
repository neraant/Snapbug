import { z } from "zod";

export const projectColorValues = [
  "#F97316",
  "#EAB308",
  "#10B981",
  "#14B8A6",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#EF4444",
] as const;

export const projectColorSchema = z.enum(projectColorValues);

export type ProjectColor = z.infer<typeof projectColorSchema>;

export const projectColorDefault: ProjectColor = projectColorValues[0];
