import { findStatsInputDtoSchema } from "@workspace/validation/modules/bug-report/dto/find-stats.schema";
import { z } from "zod";

const findWorkloadItemSchema = z.object({
  userId: z.uuid().nullable(),
  name: z.string(),
  email: z.email().nullable(),
  openCount: z.int().min(0),
});

export const findWorkloadInputDtoSchema = findStatsInputDtoSchema.pick({ projectId: true });

export type FindWorkloadInputDtoType = z.infer<typeof findWorkloadInputDtoSchema>;

export const findWorkloadOutputDtoSchema = z.array(findWorkloadItemSchema);

export type FindWorkloadOutputDtoType = z.infer<typeof findWorkloadOutputDtoSchema>;
