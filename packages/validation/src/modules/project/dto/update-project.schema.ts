import { projectColorSchema } from "@workspace/validation/shared/project-color.schema";
import { projectSlugSchema } from "@workspace/validation/shared/project-slug.schema";
import { z } from "zod";

export const updateProjectInputDtoSchema = z
  .object({
    projectId: z.uuid(),
    name: z.string().min(1).optional(),
    slug: projectSlugSchema.optional(),
    color: projectColorSchema.optional(),
    defaultAssigneeId: z.uuid().nullable().optional(),
    storeVisitorIp: z.boolean().optional(),
    collectVisitorEmail: z.boolean().optional(),
  })
  .refine(
    (value) =>
      value.name !== undefined ||
      value.slug !== undefined ||
      value.color !== undefined ||
      value.defaultAssigneeId !== undefined ||
      value.storeVisitorIp !== undefined ||
      value.collectVisitorEmail !== undefined,
    { message: "At least one field must be provided" },
  );

export type UpdateProjectInputDtoType = z.infer<typeof updateProjectInputDtoSchema>;

export const archiveProjectInputDtoSchema = z.object({
  projectId: z.uuid(),
});

export type ArchiveProjectInputDtoType = z.infer<typeof archiveProjectInputDtoSchema>;

export const restoreProjectInputDtoSchema = z.object({
  projectId: z.uuid(),
});

export type RestoreProjectInputDtoType = z.infer<typeof restoreProjectInputDtoSchema>;

export const deleteProjectInputDtoSchema = z.object({
  projectId: z.uuid(),
});

export type DeleteProjectInputDtoType = z.infer<typeof deleteProjectInputDtoSchema>;
