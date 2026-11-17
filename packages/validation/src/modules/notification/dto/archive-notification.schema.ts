import { z } from "zod";

export const archiveNotificationInputDtoSchema = z.object({
  ids: z.array(z.uuid()).min(1),
});

export const archiveNotificationOutputDtoSchema = z.object({
  updated: z.number().int().nonnegative(),
});

export type ArchiveNotificationInputDtoType = z.infer<typeof archiveNotificationInputDtoSchema>;
export type ArchiveNotificationOutputDtoType = z.infer<typeof archiveNotificationOutputDtoSchema>;